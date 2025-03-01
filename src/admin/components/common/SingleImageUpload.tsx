import React, { useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Delete } from '@mui/icons-material';
import AdobeCommerceService from '../../../services/AdobeCommerceService';
import { imageOptimization } from '../../../services/optimization/ImageOptimizationService';

interface SingleImageUploadProps {
  currentImage?: string;
  onImageUpload: (url: string) => void;
  label?: string;
  size?: 'thumbnail' | 'small' | 'medium' | 'large';
}

const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
  currentImage,
  onImageUpload,
  label = 'Image',
  size = 'medium'
}) => {
  const adobeCommerceService = AdobeCommerceService.getInstance({
    baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL,
    accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    try {
      // Optimize the image blob before upload
      const optimizedBlob = await imageOptimization.optimizeImageBlob(file);
      
      const formData = new FormData();
      formData.append('file', optimizedBlob, file.name);
      
      const response = await adobeCommerceService.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Get optimized URL with correct dimensions
      const optimizedUrl = await imageOptimization.optimizeImage(
        response.url,
        imageOptimization.getResponsiveImageSizes(size)
      );

      onImageUpload(optimizedUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }, [onImageUpload, size]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
  });

  const handleRemove = () => {
    onImageUpload('');
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>{label}</Typography>
      {currentImage ? (
        <Card>
          <Box sx={{ position: 'relative' }}>
            <img
              src={currentImage}
              alt={label}
              style={{
                width: '100%',
                height: 200,
                objectFit: 'contain',
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
              onClick={handleRemove}
            >
              <Delete sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Card>
      ) : (
        <Card
          {...getRootProps()}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <CardContent>
            <input {...getInputProps()} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 2,
              }}
            >
              <Typography color="textSecondary" align="center">
                {isDragActive
                  ? 'Drop the image here'
                  : 'Drag and drop an image here, or click to select'}
              </Typography>
              <Button variant="outlined" sx={{ mt: 1 }}>
                Select Image
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SingleImageUpload;
