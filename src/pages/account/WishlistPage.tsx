import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_WISHLIST, REMOVE_FROM_WISHLIST } from '../../graphql/customer';
import { useCommerce } from '../../store/CommerceContext';

const WishlistPage: React.FC = () => {
  const { addToCart } = useCommerce();
  const { data, loading, error } = useQuery(GET_WISHLIST);
  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST);

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist({
        variables: { productId },
        refetchQueries: [{ query: GET_WISHLIST }],
      });
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading wishlist: {error.message}
      </Alert>
    );
  }

  const wishlistItems = data?.wishlist?.items || [];

  if (wishlistItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Your Wishlist is Empty
        </Typography>
        <Typography color="text.secondary" paragraph>
          Add items to your wishlist while shopping to save them for later.
        </Typography>
        <Button component={Link} to="/products" variant="contained">
          Browse Products
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        My Wishlist
      </Typography>
      <Grid container spacing={3}>
        {wishlistItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.product.images[0]?.url}
                alt={item.product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  £{item.product.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleAddToCart(item.product.id)}
                >
                  Add to Cart
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleRemove(item.product.id)}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WishlistPage;
