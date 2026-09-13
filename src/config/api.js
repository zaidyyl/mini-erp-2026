// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://minierp.rbnetto.dev/api',
  ENDPOINTS: {
    LOGIN: '/users/users/login/',
    PROFILE: '/users/users/profile/',
    PRODUCTS: '/inventory/products/',
    CATEGORIES: '/inventory/categories/',
    CUSTOMERS: '/sales/customers/',
    ORDERS: '/sales/orders/',
    DASHBOARD: '/reports/reports/dashboard_summary/',
    SALES_REPORT: '/reports/reports/sales_report/',
    INVENTORY_REPORT: '/reports/reports/inventory_report/'
  }
}

// Test credentials from Mini ERP
export const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@minierp.com',
    password: 'test123456'
  },
  manager: {
    email: 'manager@minierp.com', 
    password: 'test123456'
  },
  sales: {
    email: 'sales@minierp.com',
    password: 'test123456'
  }
}
