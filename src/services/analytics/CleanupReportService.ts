import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import nodemailer from 'nodemailer';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { pool } from '../../db/pool';

interface ReportConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'excel' | 'pdf' | 'both';
  metrics: string[];
}

export class CleanupReportService {
  private chartRenderer: ChartJSNodeCanvas;

  constructor() {
    this.chartRenderer = new ChartJSNodeCanvas({
      width: 800,
      height: 400,
      backgroundColour: 'white',
    });
  }

  async generateExcelReport(timeRange: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    
    // Add performance metrics sheet
    const metricsSheet = workbook.addWorksheet('Performance Metrics');
    const metrics = await this.fetchPerformanceMetrics(timeRange);
    
    metricsSheet.columns = [
      { header: 'Timestamp', key: 'timestamp' },
      { header: 'Success Rate', key: 'success_rate' },
      { header: 'Avg Cleanup Time (s)', key: 'avg_cleanup_time' },
      { header: 'Total Attempts', key: 'total_attempts' },
      { header: 'Failed Cleanups', key: 'failed_cleanups' },
    ];
    
    metricsSheet.addRows(metrics);

    // Add error analysis sheet
    const errorSheet = workbook.addWorksheet('Error Analysis');
    const errors = await this.fetchErrorAnalysis(timeRange);
    
    errorSheet.columns = [
      { header: 'Error Type', key: 'error_type' },
      { header: 'Occurrences', key: 'count' },
      { header: 'First Seen', key: 'first_seen' },
      { header: 'Last Seen', key: 'last_seen' },
      { header: 'Avg Retries', key: 'avg_retries' },
    ];
    
    errorSheet.addRows(errors);

    // Add customer impact sheet
    const customerSheet = workbook.addWorksheet('Customer Impact');
    const customerImpact = await this.fetchCustomerImpact(timeRange);
    
    customerSheet.columns = [
      { header: 'Customer Number', key: 'customer_number' },
      { header: 'Total Messages', key: 'total_messages' },
      { header: 'Success Rate', key: 'success_rate' },
      { header: 'Avg Cleanup Time', key: 'avg_cleanup_time' },
      { header: 'Affected Sessions', key: 'affected_sessions' },
    ];
    
    customerSheet.addRows(customerImpact);

    // Generate charts and add them to sheets
    const charts = await this.generateCharts(timeRange);
    for (const [name, chart] of Object.entries(charts)) {
      const chartSheet = workbook.addWorksheet(name);
      const imageId = workbook.addImage({
        buffer: chart,
        extension: 'png',
      });
      chartSheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 800, height: 400 },
      });
    }

    return workbook.xlsx.writeBuffer();
  }

  async generatePDFReport(timeRange: string): Promise<Buffer> {
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    
    // Add title and date
    doc
      .fontSize(20)
      .text('Cleanup System Analytics Report', { align: 'center' })
      .fontSize(12)
      .text(`Generated on ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, { align: 'center' })
      .moveDown(2);

    // Add performance summary
    const metrics = await this.fetchPerformanceMetrics(timeRange);
    doc
      .fontSize(16)
      .text('Performance Summary')
      .moveDown(1);

    const summary = this.calculateSummaryMetrics(metrics);
    Object.entries(summary).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`);
    });
    doc.moveDown(2);

    // Add charts
    const charts = await this.generateCharts(timeRange);
    for (const [name, chart] of Object.entries(charts)) {
      doc
        .fontSize(16)
        .text(name)
        .moveDown(1)
        .image(chart, { width: 500 })
        .moveDown(2);
    }

    doc.end();

    return Buffer.concat(chunks);
  }

  async scheduleReport(config: ReportConfig): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const timeRange = this.getTimeRangeForFrequency(config.frequency);
    const attachments: any[] = [];

    if (config.format === 'excel' || config.format === 'both') {
      const excelBuffer = await this.generateExcelReport(timeRange);
      attachments.push({
        filename: `cleanup_report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`,
        content: excelBuffer,
      });
    }

    if (config.format === 'pdf' || config.format === 'both') {
      const pdfBuffer = await this.generatePDFReport(timeRange);
      attachments.push({
        filename: `cleanup_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`,
        content: pdfBuffer,
      });
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: config.recipients.join(','),
      subject: `Cleanup System Analytics Report - ${format(new Date(), 'yyyy-MM-dd')}`,
      text: 'Please find attached the latest cleanup system analytics report.',
      attachments,
    });
  }

  private async fetchPerformanceMetrics(timeRange: string) {
    const query = `
      SELECT *
      FROM v_cleanup_hourly_metrics
      WHERE hour >= NOW() - INTERVAL '${timeRange}'
      ORDER BY hour DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  private async fetchErrorAnalysis(timeRange: string) {
    const query = `
      SELECT *
      FROM v_cleanup_error_analysis
      WHERE last_occurrence >= NOW() - INTERVAL '${timeRange}'
      ORDER BY occurrence_count DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  private async fetchCustomerImpact(timeRange: string) {
    const query = `
      SELECT *
      FROM v_cleanup_customer_impact
      WHERE EXISTS (
        SELECT 1
        FROM message_cleanup mc
        WHERE mc.customer_number = v_cleanup_customer_impact.customer_number
        AND mc.created_at >= NOW() - INTERVAL '${timeRange}'
      )
      ORDER BY total_messages DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  private async generateCharts(timeRange: string): Promise<Record<string, Buffer>> {
    const metrics = await this.fetchPerformanceMetrics(timeRange);
    const charts: Record<string, Buffer> = {};

    // Success Rate Trend
    charts['Success Rate Trend'] = await this.chartRenderer.renderToBuffer({
      type: 'line',
      data: {
        labels: metrics.map(m => format(new Date(m.hour), 'MM/dd HH:mm')),
        datasets: [{
          label: 'Success Rate (%)',
          data: metrics.map(m => m.avg_success_rate),
          borderColor: '#0088FE',
          fill: false,
        }],
      },
    });

    // Cleanup Time Distribution
    charts['Cleanup Time Distribution'] = await this.chartRenderer.renderToBuffer({
      type: 'bar',
      data: {
        labels: metrics.map(m => format(new Date(m.hour), 'MM/dd HH:mm')),
        datasets: [{
          label: 'Avg Cleanup Time (s)',
          data: metrics.map(m => m.avg_cleanup_time_seconds),
          backgroundColor: '#00C49F',
        }],
      },
    });

    return charts;
  }

  private calculateSummaryMetrics(metrics: any[]) {
    return {
      'Average Success Rate': `${(metrics.reduce((acc, m) => acc + m.avg_success_rate, 0) / metrics.length).toFixed(2)}%`,
      'Average Cleanup Time': `${(metrics.reduce((acc, m) => acc + m.avg_cleanup_time_seconds, 0) / metrics.length).toFixed(2)}s`,
      'Total Messages Processed': metrics.reduce((acc, m) => acc + m.total_attempts, 0),
      'Total Failures': metrics.reduce((acc, m) => acc + m.failed_cleanups, 0),
    };
  }

  private getTimeRangeForFrequency(frequency: string): string {
    switch (frequency) {
      case 'daily':
        return '1 day';
      case 'weekly':
        return '7 days';
      case 'monthly':
        return '30 days';
      default:
        return '1 day';
    }
  }
}
