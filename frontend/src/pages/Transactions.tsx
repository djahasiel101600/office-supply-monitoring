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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { SupplyTransaction, Supply, User } from "../types";
import { transactionAPI, supplyAPI, userAPI } from "../services/api";

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<SupplyTransaction[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    supply: "",
    transaction_type: "IN" as "IN" | "OUT",
    quantity: 0,
    reason: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, suppliesRes, usersRes] = await Promise.all([
        transactionAPI.getAll(),
        supplyAPI.getAll(),
        userAPI.getAll(),
      ]);
      setTransactions(transactionsRes.data);
      setSupplies(suppliesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Convert supply from string (id) to number before sending to API
      await transactionAPI.create({
        ...formData,
        supply: Number(formData.supply),
      });

      setDialogOpen(false);
      setFormData({
        supply: "",
        transaction_type: "IN",
        quantity: 0,
        reason: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error creating transaction:", error);
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
        <Typography variant="h4">Transactions</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Transaction
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Supply</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.supply_name}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.transaction_type}
                    color={
                      transaction.transaction_type === "IN"
                        ? "success"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{transaction.quantity}</TableCell>
                <TableCell>{transaction.user_name}</TableCell>
                <TableCell>{transaction.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Supply</InputLabel>
              <Select
                value={formData.supply}
                onChange={(e) =>
                  setFormData({ ...formData, supply: e.target.value })
                }
                label="Supply"
              >
                {supplies.map((supply) => (
                  <MenuItem key={supply.id} value={supply.id}>
                    {supply.name} (Current: {supply.current_quantity}{" "}
                    {supply.unit})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={formData.transaction_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transaction_type: e.target.value as "IN" | "OUT",
                  })
                }
                label="Transaction Type"
              >
                <MenuItem value="IN">Incoming</MenuItem>
                <MenuItem value="OUT">Outgoing</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseInt(e.target.value) })
              }
              fullWidth
            />
            <TextField
              label="Reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;
