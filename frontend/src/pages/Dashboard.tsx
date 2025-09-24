import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { transactionAPI, supplyAPI } from "../services/api";
import { SupplyTransaction } from "../types";
import { Supply } from "../types";

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<SupplyTransaction[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await transactionAPI.getAll();
        setTransactions(res.data);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };
    const fetchSupplies = async () => {
      try {
        const res = await supplyAPI.getAll();
        setSupplies(res.data);
      } catch (error) {
        console.log("Failed to fetch supplies");
      }
    };
    fetchTransactions();
    fetchSupplies();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Supplies
              </Typography>
              <Typography variant="h4">
                {supplies
                  .map((item) => item.current_quantity)
                  .reduce((acc, num) => acc + num, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h4">
                {
                  supplies.filter(
                    (item) => item.current_quantity <= item.minimum_quantity
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Incoming (recent)
              </Typography>
              <Typography variant="h4">
                {transactions
                  .filter((item) => item.transaction_type === "IN")
                  .map((item) => item.quantity)
                  .reduce((acc, num) => acc + num, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Outgoing (recent)
              </Typography>
              <Typography variant="h4">
                {transactions
                  .filter((item) => item.transaction_type === "OUT")
                  .map((item) => item.quantity)
                  .reduce((acc, num) => acc + num, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
