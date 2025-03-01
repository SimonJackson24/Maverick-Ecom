import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Alert,
  Slider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Preview as PreviewIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

interface OptimizedImage {
  id: string;
  originalName: string;
  originalSize: number;
  optimizedSize: number;
  optimizedUrl: string;
  format: string;
  dimensions: string;
  status: 'processing' | 'completed' | 'error';
  error?: string;
}

interface OptimizationSettings {
  quality: number;
  maxWidth: number;
  convertToWebP: boolean;
  preserveExif: boolean;
  compressMetadata: boolean;
}

export const ImageOptimizer: React.FC = () => {
  const [images, setImages] = useState<OptimizedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<OptimizationSettings>({
    quality: 85,
    maxWidth: 1920,
    convertToWebP: true,
    preserveExif: false,
    compressMetadata: true,
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);
    const newImages: OptimizedImage[] = [];

    for (const file of acceptedFiles) {
      // Create a preview URL
      const reader = new FileReader();
      const imageUrl = URL.createObjectURL(file);

      // Get image dimensions
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = imageUrl;
      });

      // Simulate optimization process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const optimizedSize = Math.floor(file.size * (settings.quality / 100));
      
      newImages.push({
        id: Math.random().toString(36).substr(2, 9),
        originalName: file.name,
        originalSize: file.size,
        optimizedSize: optimizedSize,
        optimizedUrl: imageUrl,
        format: settings.convertToWebP ? 'webp' : file.name.split('.').pop() || '',
        dimensions: `${img.width}x${img.height}`,
        status: 'completed',
      });
    }

    setImages((prev) => [...prev, ...newImages]);
    setLoading(false);
  }, [settings]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true,
  });

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateSavings = (original: number, optimized: number) => {
    const saving = ((original - optimized) / original) * 100;
    return saving.toFixed(1);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Image Optimizer</Typography>
            <Tooltip title="Optimization Settings">
              <IconButton onClick={() => setSettingsOpen(true)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Paper
            {...getRootProps()}
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'divider',
              cursor: 'pointer',
              mb: 3,
            }}
          >
            <input {...getInputProps()} />
            <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to select files
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Supports PNG, JPG, JPEG, GIF, WebP
            </Typography>
          </Paper>

          {loading && <LinearProgress sx={{ mb: 3 }} />}

          {images.length > 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Original Size</TableCell>
                    <TableCell>Optimized Size</TableCell>
                    <TableCell>Savings</TableCell>
                    <TableCell>Format</TableCell>
                    <TableCell>Dimensions</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {images.map((image) => (
                    <TableRow key={image.id}>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {image.originalName}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatBytes(image.originalSize)}</TableCell>
                      <TableCell>{formatBytes(image.optimizedSize)}</TableCell>
                      <TableCell>
                        <Typography
                          color={
                            Number(calculateSavings(image.originalSize, image.optimizedSize)) > 0
                              ? 'success.main'
                              : 'error.main'
                          }
                        >
                          {calculateSavings(image.originalSize, image.optimizedSize)}%
                        </Typography>
                      </TableCell>
                      <TableCell>{image.format.toUpperCase()}</TableCell>
                      <TableCell>{image.dimensions}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Preview">
                          <IconButton
                            size="small"
                            onClick={() => setPreviewImage(image.optimizedUrl)}
                          >
                            <PreviewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={() => window.open(image.optimizedUrl)}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(image.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {images.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="success">
                Total savings:{' '}
                {formatBytes(
                  images.reduce((acc, img) => acc + (img.originalSize - img.optimizedSize), 0)
                )}
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Optimization Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ width: 300, pt: 2 }}>
            <Typography gutterBottom>Quality</Typography>
            <Slider
              value={settings.quality}
              onChange={(_, value) =>
                setSettings((prev) => ({ ...prev, quality: value as number }))
              }
              valueLabelDisplay="auto"
              min={1}
              max={100}
              marks={[
                { value: 1, label: '1%' },
                { value: 50, label: '50%' },
                { value: 100, label: '100%' },
              ]}
            />

            <Typography gutterBottom sx={{ mt: 2 }}>Max Width</Typography>
            <Slider
              value={settings.maxWidth}
              onChange={(_, value) =>
                setSettings((prev) => ({ ...prev, maxWidth: value as number }))
              }
              valueLabelDisplay="auto"
              min={100}
              max={3840}
              step={100}
              marks={[
                { value: 100, label: '100px' },
                { value: 1920, label: '1920px' },
                { value: 3840, label: '4K' },
              ]}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.convertToWebP}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      convertToWebP: e.target.checked,
                    }))
                  }
                />
              }
              label="Convert to WebP"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.preserveExif}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      preserveExif: e.target.checked,
                    }))
                  }
                />
              }
              label="Preserve EXIF data"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.compressMetadata}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      compressMetadata: e.target.checked,
                    }))
                  }
                />
              }
              label="Compress metadata"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box
              component="img"
              src={previewImage}
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewImage(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
