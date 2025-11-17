import { getApperClient } from "@/services/apperClient";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
class OrderService {
  constructor() {
    this.apperClient = null;
  }

  async initClient() {
    if (!this.apperClient) {
      this.apperClient = getApperClient();
    }
    return this.apperClient;
  }

  transformOrderData(record) {
    let items = [];
    let tracking = { carrier: "", trackingNumber: "", events: [] };
    let shippingAddress = {};

    try {
      if (record.items_c) {
        items = typeof record.items_c === 'string' ? JSON.parse(record.items_c) : record.items_c;
      }
    } catch (e) {
      console.error("Error parsing items:", e);
      items = [];
    }

    try {
      if (record.tracking_c) {
        tracking = typeof record.tracking_c === 'string' ? JSON.parse(record.tracking_c) : record.tracking_c;
      }
    } catch (e) {
      console.error("Error parsing tracking:", e);
      tracking = { carrier: "", trackingNumber: "", events: [] };
    }

try {
      if (record.shipping_address_c) {
        shippingAddress = typeof record.shipping_address_c === 'string' ? JSON.parse(record.shipping_address_c) : record.shipping_address_c;
      }
    } catch (e) {
      console.error("Error parsing shipping address:", e);
      shippingAddress = {};
    }

    return {
      Id: record.Id,
      orderNumber: record.order_number_c || '',
      orderDate: record.order_date_c || '',
      status: record.status_c || 'confirmed',
      total: parseFloat(record.total_c || 0),
      items,
      shippingAddress,
      tracking
    };
  }

  async createOrder(orderData) {
    try {
      await this.initClient();
      
      const orderNumber = `VT${Date.now().toString().slice(-6)}`;
      const trackingData = {
        carrier: "FedEx",
        trackingNumber: `TRK${Date.now().toString().slice(-8)}`,
        events: [
          { date: new Date().toISOString(), status: "Order placed", location: "Online" }
        ]
      };

      const response = await this.apperClient.createRecord('orders_c', {
        records: [
          {
            Name: orderNumber,
            order_number_c: orderNumber,
            order_date_c: new Date().toISOString(),
            status_c: "confirmed",
            total_c: orderData.totalAmount || 0,
            items_c: JSON.stringify(orderData.items || []),
            shipping_address_c: JSON.stringify(orderData.shippingAddress || {}),
            tracking_c: JSON.stringify(trackingData)
          }
        ]
      });

      if (!response?.success) {
        console.error(response?.message);
        return { success: false, error: response?.message || "Failed to create order" };
      }

      if (response.results && response.results[0]) {
        const createdOrder = response.results[0];
        if (createdOrder.success) {
          return {
            success: true,
data: this.transformOrderData(createdOrder.data)
        };
      } else {
        console.error(`Failed to create order:`, createdOrder);
        return { success: false, error: "Failed to create order" };
      }
    }

    return { success: false, error: "Failed to create order" };
  } catch (error) {
    console.error("Error creating order:", error?.response?.data?.message || error);
    return { success: false, error: "Failed to create order" };
  }
}

  async getOrderById(id) {
    try {
      await this.initClient();

      const response = await this.apperClient.getRecordById('orders_c', parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "order_number_c" } },
          { field: { Name: "order_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "total_c" } },
          { field: { Name: "items_c" } },
          { field: { Name: "shipping_address_c" } },
          { field: { Name: "tracking_c" } }
        ]
      });

      if (!response?.success || !response?.data) {
        return { success: false, error: "Order not found" };
      }

      return {
        success: true,
        data: this.transformOrderData(response.data)
      };
    } catch (error) {
      console.error("Error fetching order:", error?.response?.data?.message || error);
      return { success: false, error: "Order not found" };
    }
  }
  async getUserOrders(filters = {}) {
    try {
      await this.initClient();
      if (!this.apperClient) {
        return { success: true, data: [] };
      }

      const whereConditions = [];

      if (filters.status && filters.status !== 'all') {
        whereConditions.push({
          FieldName: "status_c",
          Operator: "EqualTo",
          Values: [filters.status]
        });
      }

      const response = await this.apperClient.fetchRecords('orders_c', {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "order_number_c" } },
          { field: { Name: "order_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "total_c" } },
          { field: { Name: "items_c" } },
          { field: { Name: "shipping_address_c" } },
          { field: { Name: "tracking_c" } }
        ],
        where: whereConditions,
        orderBy: [{ fieldName: "order_date_c", sorttype: "DESC" }]
      });

      if (!response?.success) {
        return { success: true, data: [] };
      }

let orders = (response.data || []).map(record => this.transformOrderData(record));

    // Apply client-side search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      orders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.items.some(item => item.name?.toLowerCase().includes(query))
      );
    }

    return {
      success: true,
      data: orders
    };
  } catch (error) {
    console.error("Error fetching user orders:", error?.response?.data?.message || error);
    return { success: true, data: [] };
  }
}
  async getOrderTracking(orderId) {
    try {
      await this.initClient();
      if (!this.apperClient) {
        return { success: false, error: "Order not found" };
      }

      const response = await this.apperClient.getRecordById('orders_c', parseInt(orderId), {
        fields: [
          { field: { Name: "tracking_c" } }
        ]
      });

      if (!response?.success || !response?.data) {
        return { success: false, error: "Order not found" };
      }

      let tracking = { carrier: "", trackingNumber: "", events: [] };
      try {
        if (response.data.tracking_c) {
          tracking = typeof response.data.tracking_c === 'string' ? JSON.parse(response.data.tracking_c) : response.data.tracking_c;
        }
      } catch (e) {
        console.error("Error parsing tracking:", e);
      }

      return {
        success: true,
        data: tracking
      };
    } catch (error) {
      console.error("Error fetching order tracking:", error?.response?.data?.message || error);
      return { success: false, error: "Order not found" };
    }
  }

  async updateOrderStatus(orderId, newStatus) {
    try {
      await this.initClient();
      if (!this.apperClient) {
        return { success: false, error: "Order not found" };
      }

      // Get current order first
      const getResponse = await this.apperClient.getRecordById('orders_c', parseInt(orderId), {
        fields: [
          { field: { Name: "status_c" } },
          { field: { Name: "tracking_c" } }
        ]
      });

      if (!getResponse?.success || !getResponse?.data) {
        return { success: false, error: "Order not found" };
      }

      let tracking = { carrier: "", trackingNumber: "", events: [] };
      try {
        if (getResponse.data.tracking_c) {
          tracking = typeof getResponse.data.tracking_c === 'string' ? JSON.parse(getResponse.data.tracking_c) : getResponse.data.tracking_c;
        }
      } catch (e) {
        console.error("Error parsing tracking:", e);
      }

      // Add tracking event
      const trackingEvent = {
        date: new Date().toISOString(),
        status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
        location: "Warehouse"
      };
      tracking.events.push(trackingEvent);

      const updateResponse = await this.apperClient.updateRecord('orders_c', {
        records: [
          {
            Id: parseInt(orderId),
            status_c: newStatus,
            tracking_c: JSON.stringify(tracking)
          }
        ]
      });

if (!updateResponse?.success) {
      console.error(updateResponse?.message);
      return { success: false, error: "Failed to update order status" };
    }

    if (updateResponse.results && updateResponse.results[0] && updateResponse.results[0].success) {
      return {
        success: true,
        data: this.transformOrderData(updateResponse.results[0].data)
      };
    }

    return { success: false, error: "Failed to update order status" };
  } catch (error) {
    console.error("Error updating order status:", error?.response?.data?.message || error);
    return { success: false, error: "Failed to update order status" };
  }
}
async processPayment(paymentData) {
    try {
      await delay(1000);

      // Simulate payment processing
      const success = Math.random() > 0.1; // 90% success rate

      if (success) {
        return {
          success: true,
          data: {
            transactionId: `txn_${Date.now()}`,
            status: "completed"
          }
        };
      } else {
        return {
          success: false,
          error: "Payment failed. Please try again."
        };
      }
    } catch (error) {
      console.error("Error processing payment:", error?.response?.data?.message || error);
      return {
        success: false,
        error: "Payment processing error"
      };
    }
  }
}

export default new OrderService();