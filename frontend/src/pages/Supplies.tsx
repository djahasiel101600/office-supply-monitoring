import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Supply, SupplyCategory } from "../types";
import { supplyAPI, supplyCategoryAPI } from "../services/api";

import Grid from "@mui/material/Grid";

const Supplies: React.FC = () => {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [categories, setCategories] = useState<SupplyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    unit: "",
    minimum_quantity: 0,
    current_quantity: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [suppliesRes, categoriesRes] = await Promise.all([
        supplyAPI.getAll(),
        supplyCategoryAPI.getAll(),
      ]);
      setSupplies(suppliesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        category: Number(formData.category),
      };
      if (editingSupply) {
        await supplyAPI.update(editingSupply.id, payload);
      } else {
        await supplyAPI.create(payload);
      }
      setDialogOpen(false);
      setEditingSupply(null);
      setFormData({
        name: "",
        category: "",
        description: "",
        unit: "",
        minimum_quantity: 0,
        current_quantity: 0,
      });
      fetchData();
    } catch (error) {
      console.error("Error saving supply:", error);
    }
  };

  const handleEdit = (supply: Supply) => {
    setEditingSupply(supply);
    setFormData({
      name: supply.name,
      category: supply.category.toString(),
      description: supply.description,
      unit: supply.unit,
      minimum_quantity: supply.minimum_quantity,
      current_quantity: supply.current_quantity,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this supply?")) {
      try {
        await supplyAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting supply:", error);
      }
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Supplies</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Supply
        </Button>
      </Box>

      <Grid container spacing={3}>
        {supplies.map((supply) => (
          <Grid key={supply.id} size={{ xs: 12, md: 4, sm: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {supply.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {supply.category_name}
                </Typography>
                <Typography variant="body2" paragraph>
                  {supply.description}
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2">
                    Current: {supply.current_quantity} {supply.unit}
                  </Typography>
                  {supply.current_quantity <= supply.minimum_quantity && (
                    <Chip label="Low Stock" color="warning" size="small" />
                  )}
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Minimum: {supply.minimum_quantity} {supply.unit}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(supply)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(supply.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSupply ? "Edit Supply" : "Add New Supply"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Unit"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Minimum Quantity"
              type="number"
              value={formData.minimum_quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimum_quantity: parseInt(e.target.value),
                })
              }
              fullWidth
            />
            <TextField
              label="Current Quantity"
              type="number"
              value={formData.current_quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  current_quantity: parseInt(e.target.value),
                })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSupply ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Supplies;
