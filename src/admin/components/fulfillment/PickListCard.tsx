import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import { PickList } from '../../types/fulfillment';

interface PickListCardProps {
  pickList: PickList;
  onUpdatePickedQuantity: (productId: string, quantity: number) => void;
  onComplete: () => void;
}

const PickListCard: React.FC<PickListCardProps> = ({
  pickList,
  onUpdatePickedQuantity,
  onComplete,
}) => {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(
      pickList.items.map((item) => [item.productId, item.pickedQuantity])
    )
  );

  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = Math.max(0, Math.min(Number(value) || 0, 
      pickList.items.find(item => item.productId === productId)?.totalQuantity || 0
    ));
    
    setQuantities((prev) => ({ ...prev, [productId]: quantity }));
    onUpdatePickedQuantity(productId, quantity);
  };

  const isComplete = pickList.items.every(
    (item) => quantities[item.productId] === item.totalQuantity
  );

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Pick List #{pickList.id}</Typography>
            <Chip
              label={pickList.status}
              color={
                pickList.status === 'COMPLETED'
                  ? 'success'
                  : pickList.status === 'IN_PROGRESS'
                  ? 'warning'
                  : 'default'
              }
            />
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="right">Required</TableCell>
                  <TableCell align="right">Picked</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pickList.items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.location || 'N/A'}</TableCell>
                    <TableCell align="right">{item.totalQuantity}</TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        value={quantities[item.productId]}
                        onChange={(e) =>
                          handleQuantityChange(item.productId, e.target.value)
                        }
                        size="small"
                        inputProps={{
                          min: 0,
                          max: item.totalQuantity,
                          style: { textAlign: 'right' },
                        }}
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            color="primary"
            disabled={!isComplete || pickList.status === 'COMPLETED'}
            onClick={onComplete}
            fullWidth
          >
            Complete Pick List
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PickListCard;
