import { useState, useEffect, useMemo, memo, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  Grid,
  Fade,
  Slide,
  Modal,
} from "@mui/material";
import {
  ShoppingCart,
  CreditCard,
  LocalShipping,
  CheckCircle,
  Delete,
  Add,
  Remove,
  ArrowBack,
  ArrowForward,
  Close,
} from "@mui/icons-material";
import { useCartStore, type Cart } from "../store/filterStore";

type Props = {
  open: boolean;
  onClose: () => void;
};

const TAX_RATE = 0.1;

const CartReview = memo(
  ({
    cart,
    subtotal,
    tax,
    total,
    updateQuantity,
    removeItem,
  }: {
    cart: Cart;
    subtotal: number;
    tax: number;
    total: number;
    updateQuantity: (id: number, qty: number) => void;
    removeItem: (id: number) => void;
  }) => (
    <Fade in timeout={500}>
      <Box>
        {cart.items.length === 0 ? (
          <Box textAlign="center" py={6}>
            <ShoppingCart sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
            <Typography variant="h6" gutterBottom color="text.secondary">
              Your cart is empty
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Add some items to get started!
            </Typography>
          </Box>
        ) : (
          <Box>
            <Box sx={{ maxHeight: "400px", overflowY: "auto", mb: 3 }}>
              {cart.items.map((item) => (
                <Card
                  key={item.product.id}
                  sx={{ mb: 2, display: "flex", p: 2 }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 80, height: 80, borderRadius: 1 }}
                    image={item.product.imageUrl}
                    alt={item.product.name}
                  />
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      py: 0,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.product.price.toFixed(2)}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography sx={{ minWidth: 30, textAlign: "center" }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="flex-end"
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => removeItem(item.product.id)}
                      aria-label="Remove item"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Box>

            <Paper elevation={2} sx={{ p: 3, bgcolor: "grey.50" }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Subtotal:</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Tax (10%):</Typography>
                <Typography>${tax.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold">
                  Total:
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Fade>
  ),
);

const ShippingForm = memo(
  ({
    shippingDetails,
    setShippingDetails,
    shippingErrors,
  }: {
    shippingDetails: any;
    setShippingDetails: (details: any) => void;
    shippingErrors: Record<string, string>;
  }) => (
    <Fade in timeout={500}>
      <Box sx={{ maxHeight: "450px", overflowY: "auto", pr: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Full Name"
              required
              value={shippingDetails.fullName}
              onChange={(e) =>
                setShippingDetails({
                  ...shippingDetails,
                  fullName: e.target.value,
                })
              }
              error={!!shippingErrors.fullName}
              helperText={shippingErrors.fullName}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Address"
              required
              value={shippingDetails.address}
              onChange={(e) =>
                setShippingDetails({
                  ...shippingDetails,
                  address: e.target.value,
                })
              }
              error={!!shippingErrors.address}
              helperText={shippingErrors.address}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="City"
              required
              value={shippingDetails.city}
              onChange={(e) =>
                setShippingDetails({
                  ...shippingDetails,
                  city: e.target.value,
                })
              }
              error={!!shippingErrors.city}
              helperText={shippingErrors.city}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Postal Code"
              required
              placeholder="12345"
              value={shippingDetails.postalCode}
              onChange={(e) =>
                setShippingDetails({
                  ...shippingDetails,
                  postalCode: e.target.value,
                })
              }
              error={!!shippingErrors.postalCode}
              helperText={shippingErrors.postalCode}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Phone Number"
              required
              placeholder="+7 747 567 8900"
              value={shippingDetails.phone}
              onChange={(e) =>
                setShippingDetails({
                  ...shippingDetails,
                  phone: e.target.value,
                })
              }
              error={!!shippingErrors.phone}
              helperText={shippingErrors.phone}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ fontSize: "0.875rem", mb: 1 }}
              >
                Delivery Time Slot
              </FormLabel>
              <RadioGroup
                row
                value={shippingDetails.deliverySlot}
                onChange={(e) =>
                  setShippingDetails({
                    ...shippingDetails,
                    deliverySlot: e.target.value,
                  })
                }
              >
                <FormControlLabel
                  value="morning"
                  control={<Radio size="small" />}
                  label="Morning"
                />
                <FormControlLabel
                  value="afternoon"
                  control={<Radio size="small" />}
                  label="Afternoon"
                />
                <FormControlLabel
                  value="evening"
                  control={<Radio size="small" />}
                  label="Evening"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  ),
);

const PaymentForm = memo(
  ({
    paymentMethod,
    setPaymentMethod,
    cardDetails,
    setCardDetails,
    paymentErrors,
  }: {
    paymentMethod: string;
    setPaymentMethod: (method: string) => void;
    cardDetails: any;
    setCardDetails: (details: any) => void;
    paymentErrors: Record<string, string>;
  }) => (
    <Fade in timeout={500}>
      <Box sx={{ maxHeight: "450px", overflowY: "auto", pr: 1 }}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 2, fontSize: "0.875rem" }}>
            Select Payment Method
          </FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <Paper
              elevation={paymentMethod === "credit_card" ? 3 : 1}
              sx={{
                p: 1.5,
                mb: 1.5,
                border: paymentMethod === "credit_card" ? 2 : 1,
                borderColor:
                  paymentMethod === "credit_card" ? "primary.main" : "grey.300",
              }}
            >
              <FormControlLabel
                value="credit_card"
                control={<Radio size="small" />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <CreditCard fontSize="small" />
                    <Typography variant="body2">Credit Card</Typography>
                  </Box>
                }
              />
            </Paper>

            <Paper
              elevation={paymentMethod === "paypal" ? 3 : 1}
              sx={{
                p: 1.5,
                mb: 1.5,
                border: paymentMethod === "paypal" ? 2 : 1,
                borderColor:
                  paymentMethod === "paypal" ? "primary.main" : "grey.300",
              }}
            >
              <FormControlLabel
                value="paypal"
                control={<Radio size="small" />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontSize={20}>🅿️</Typography>
                    <Typography variant="body2">PayPal</Typography>
                  </Box>
                }
              />
            </Paper>

            <Paper
              elevation={paymentMethod === "cash" ? 3 : 1}
              sx={{
                p: 1.5,
                border: paymentMethod === "cash" ? 2 : 1,
                borderColor:
                  paymentMethod === "cash" ? "primary.main" : "grey.300",
              }}
            >
              <FormControlLabel
                value="cash"
                control={<Radio size="small" />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontSize={20}>💵</Typography>
                    <Typography variant="body2">Cash on Delivery</Typography>
                  </Box>
                }
              />
            </Paper>
          </RadioGroup>
        </FormControl>

        {paymentMethod === "credit_card" && (
          <Slide direction="down" in mountOnEnter unmountOnExit>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Card Number"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cardNumber: e.target.value.replace(/\s/g, ""),
                      })
                    }
                    error={!!paymentErrors.cardNumber}
                    helperText={paymentErrors.cardNumber}
                    inputProps={{ maxLength: 16 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Expiry Date"
                    required
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        expiry: e.target.value,
                      })
                    }
                    error={!!paymentErrors.expiry}
                    helperText={paymentErrors.expiry}
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="CVV"
                    required
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvv: e.target.value })
                    }
                    error={!!paymentErrors.cvv}
                    helperText={paymentErrors.cvv}
                    inputProps={{ maxLength: 4 }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Slide>
        )}

        {paymentMethod === "paypal" && (
          <Alert severity="info" sx={{ mt: 2 }}>
            You will be redirected to PayPal to complete your payment securely.
          </Alert>
        )}

        {paymentMethod === "cash" && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Pay with cash when your order is delivered to your doorstep.
          </Alert>
        )}
      </Box>
    </Fade>
  ),
);

const OrderConfirmation = memo(
  ({
    orderSuccess,
    orderNumber,
    cart,
    subtotal,
    tax,
    total,
    shippingDetails,
    paymentMethod,
    orderError,
    isSubmitting,
    handlePlaceOrder,
  }: {
    orderSuccess: boolean;
    orderNumber: string;
    cart: Cart;
    subtotal: number;
    tax: number;
    total: number;
    shippingDetails: any;
    paymentMethod: string;
    orderError: string;
    isSubmitting: boolean;
    handlePlaceOrder: () => void;
  }) => (
    <Fade in timeout={500}>
      <Box sx={{ maxHeight: "450px", overflowY: "auto", pr: 1 }}>
        {orderSuccess ? (
          <Box textAlign="center" py={4}>
            <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Order Placed Successfully!
            </Typography>
            <Typography color="text.secondary" mb={2} variant="body2">
              Thank you for your purchase.
            </Typography>
            <Paper
              elevation={3}
              sx={{ p: 2, display: "inline-block", bgcolor: "grey.50" }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                gutterBottom
                display="block"
              >
                Order Number
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {orderNumber}
              </Typography>
            </Paper>
            <Typography
              variant="caption"
              color="text.secondary"
              mt={2}
              display="block"
            >
              A confirmation email has been sent to your address.
            </Typography>
          </Box>
        ) : (
          <Box>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                display="flex"
                alignItems="center"
                gap={1}
              >
                <ShoppingCart fontSize="small" />
                Order Summary
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              {cart.items.map((item) => (
                <Box
                  key={item.product.id}
                  display="flex"
                  justifyContent="space-between"
                  mb={0.5}
                >
                  <Typography variant="body2">
                    {item.product.name} × {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1.5 }} />
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal:
                </Typography>
                <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Tax:
                </Typography>
                <Typography variant="body2">${tax.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Paper>

            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                display="flex"
                alignItems="center"
                gap={1}
              >
                <LocalShipping fontSize="small" />
                Shipping Address
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" fontWeight="bold">
                {shippingDetails.fullName}
              </Typography>
              <Typography variant="body2">{shippingDetails.address}</Typography>
              <Typography variant="body2">
                {shippingDetails.city}, {shippingDetails.postalCode}
              </Typography>
              <Typography variant="body2">{shippingDetails.phone}</Typography>
              <Chip
                label={`Delivery: ${shippingDetails.deliverySlot}`}
                size="small"
                sx={{ mt: 1, textTransform: "capitalize" }}
              />
            </Paper>

            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                display="flex"
                alignItems="center"
                gap={1}
              >
                <CreditCard fontSize="small" />
                Payment Method
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                {paymentMethod.replace("_", " ")}
              </Typography>
            </Paper>

            {orderError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {orderError}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              color="success"
              size="large"
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CheckCircle />
                )
              }
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </Box>
        )}
      </Box>
    </Fade>
  ),
);

const CheckoutModal = ({ open, onClose }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const {
    setCart,
    getCart,
    updateQuantity: updateStoreQuantity,
    removeItem: removeStoreItem,
    clearCart,
  } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const cart = getCart();

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setOrderSuccess(false);
      setOrderError("");
    }
  }, [open]);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    deliverySlot: "morning",
  });

  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>(
    {},
  );

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>(
    {},
  );

  const steps = [
    "Cart Review",
    "Shipping Details",
    "Payment Method",
    "Order Confirmation",
  ];

  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart.items]);

  const updateQuantity = useCallback(
    (id: number, newQuantity: number) => {
      updateStoreQuantity(id, newQuantity);
      fetch("/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id, quantity: newQuantity }),
      }).then(() => {
        fetch("/cart").then(async (res) => {
          if (!res.ok) throw new Error("Cart request failed");
          const serverCart = await res.json();
          if (serverCart?.items && serverCart?.items !== cart) {
            setCart(serverCart);
          }
        });
      });
    },
    [updateStoreQuantity, setCart, cart],
  );

  const removeItem = useCallback(
    (id: number) => {
      removeStoreItem(id);
      fetch("/cart-remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id }),
      });
    },
    [removeStoreItem],
  );

  const validateShipping = () => {
    const errors: Record<string, string> = {};

    if (!shippingDetails.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!shippingDetails.address.trim()) {
      errors.address = "Address is required";
    }

    if (!shippingDetails.city.trim()) {
      errors.city = "City is required";
    }

    if (!shippingDetails.postalCode.trim()) {
      errors.postalCode = "Postal code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(shippingDetails.postalCode)) {
      errors.postalCode = "Invalid postal code format";
    }

    if (!shippingDetails.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s()-]{10,}$/.test(shippingDetails.phone)) {
      errors.phone = "Invalid phone number format";
    }

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = () => {
    if (paymentMethod !== "credit_card") return true;

    const errors: Record<string, string> = {};

    if (!cardDetails.cardNumber.trim()) {
      errors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ""))) {
      errors.cardNumber = "Invalid card number (16 digits required)";
    }

    if (!cardDetails.expiry.trim()) {
      errors.expiry = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
      errors.expiry = "Invalid format (MM/YY)";
    }

    if (!cardDetails.cvv.trim()) {
      errors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      errors.cvv = "Invalid CVV (3-4 digits)";
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && cart.items.length === 0) return;
    if (activeStep === 1 && !validateShipping()) return;
    if (activeStep === 2 && !validatePayment()) return;

    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setOrderError("");
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setOrderError("");

    try {
      const response = await fetch("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: cart.items,
          shipping: shippingDetails,
          payment: { method: paymentMethod },
          total,
        }),
      });

      if (!response.ok) {
        throw new Error("Order failed. Please try again.");
      }

      let data;
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }
      } else {
        data = {};
      }

      setOrderNumber(data.orderNumber || `ORD-${Date.now()}`);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : "Order failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <CartReview
            cart={cart}
            subtotal={subtotal}
            tax={tax}
            total={total}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
        );
      case 1:
        return (
          <ShippingForm
            shippingDetails={shippingDetails}
            setShippingDetails={setShippingDetails}
            shippingErrors={shippingErrors}
          />
        );
      case 2:
        return (
          <PaymentForm
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cardDetails={cardDetails}
            setCardDetails={setCardDetails}
            paymentErrors={paymentErrors}
          />
        );
      case 3:
        return (
          <OrderConfirmation
            orderSuccess={orderSuccess}
            orderNumber={orderNumber}
            cart={cart}
            subtotal={subtotal}
            tax={tax}
            total={total}
            shippingDetails={shippingDetails}
            paymentMethod={paymentMethod}
            orderError={orderError}
            isSubmitting={isSubmitting}
            handlePlaceOrder={handlePlaceOrder}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="checkout-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "relative",
            width: "90%",
            maxWidth: 900,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Checkout
            </Typography>
            <IconButton
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Close checkout"
            >
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 3,
              py: 2,
            }}
          >
            {renderStep()}
          </Box>

          {!orderSuccess && (
            <Box
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                bgcolor: "grey.50",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBack}
                disabled={activeStep === 0 || isSubmitting}
              >
                Back
              </Button>

              {activeStep < 3 && (
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && cart.items.length === 0) ||
                    isSubmitting
                  }
                >
                  Next
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default CheckoutModal;
