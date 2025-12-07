import React, { useState } from "react";
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Alert,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
} from "@mui/material";

export default function PhonePricePredictor() {
    const [formData, setFormData] = useState({
        ram_capacity: "",
        internal_memory: "",
        processor_speed: "",
        screen_size: "",
        battery_capacity: "",
        num_cores: "",
        has_5g: false,
        refresh_rate: "",
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const options = {
        ram_capacity: [2, 4, 6, 8, 12, 16, 32],
        internal_memory: [32, 64, 128, 256, 512],
        processor_speed: [1.6, 1.8, 2.0, 2.2, 2.4, 2.8, 3.0, 3.2, 3.5, 3.7, 4],
        screen_size: [5.5, 6.1, 6.5, 6.8],
        battery_capacity: [3000, 4000, 4500, 5000, 5500, 6000, 6500, 7000],
        num_cores: [2, 4, 6, 8],
        refresh_rate: [60, 90, 120, 144],
    };

    const units = {
        ram_capacity: "GB",
        internal_memory: "GB",
        processor_speed: "GHz",
        screen_size: "in",
        battery_capacity: "mAh",
        num_cores: "cores",
        refresh_rate: "Hz",
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setPrediction(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    ram_capacity: parseFloat(formData.ram_capacity),
                    internal_memory: parseFloat(formData.internal_memory),
                    processor_speed: parseFloat(formData.processor_speed),
                    screen_size: parseFloat(formData.screen_size),
                    battery_capacity: parseFloat(formData.battery_capacity),
                    num_cores: parseInt(formData.num_cores),
                    has_5g: formData.has_5g ? 1 : 0,
                    refresh_rate: parseFloat(formData.refresh_rate),
                }),
            });

            if (!response.ok) throw new Error("Failed to get prediction");
            const data = await response.json();
            setPrediction(data.predicted_price);
        } catch (err) {
            setError("Something went wrong. Please check the backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 6 }}>
            <Card elevation={6} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" align="center" color="primary" gutterBottom>
                        Smartphone Price Predictor
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {Object.keys(options).map((key) => (
                                <Grid item xs={12} sm={6} key={key}>
                                    {/* Use FormControl + InputLabel + Select for consistent sizing */}
                                    <FormControl fullWidth size="medium" sx={{ minWidth: 160 }}>
                                        <InputLabel id={`${key}-label`}>
                                            {key.replaceAll("_", " ")} ({units[key]})
                                        </InputLabel>
                                        <Select
                                            labelId={`${key}-label`}
                                            id={`${key}-select`}
                                            label={`${key.replaceAll("_", " ")} (${units[key]})`}
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleChange}
                                            required
                                        >
                                            {options[key].map((val) => (
                                                <MenuItem key={val} value={val}>
                                                    {val} {units[key]}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            ))}

                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.has_5g}
                                            onChange={handleChange}
                                            name="has_5g"
                                            color="primary"
                                            sx={{ pl: 1 }}
                                        />
                                    }
                                    label="Supports 5G"
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ textAlign: "center", mt: 1 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={22} /> : "Predict Price"}
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                {error && <Alert severity="error">{error}</Alert>}
                                {prediction !== null && !error && (
                                    <Alert severity="success" sx={{ mt: 2 }}>
                                        Predicted Price: <strong>${prediction}</strong>
                                    </Alert>
                                )}
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}
