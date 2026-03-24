/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ICompany {
  id: string;
  name: string;
}

export interface IOrder {
  order_detail: any;
  _id: string; // MongoDB IDs are strings on the frontend
  category: string;
  patient_name: string;
  clinic_name: string;
  doctor_name: string;
  prod_name: string;
  rx_date: string;
  due_date: string;
  doctor_instruction: string;
  gender: string;
  age: number;
  isUrgent: boolean;
  is_remake: boolean;
  designedPath: string;
  designerId: string;
  deliveryId: string;

  shade: string;

  status:
    | "Pending"
    | "Designing"
    | "Milled"
    | "Completed"
    | "Delivered"
    | "Unaccepted"; // Example statuses
  isAccepted: boolean;
  isMilled: boolean;
  isScanned: boolean;
  isDesigned: boolean;
  isDelivered: boolean;
  isStained: boolean;
  isAdminApproved: boolean;
  isClientApproved: boolean;
  remake_reason: string;
  is_discounted: boolean;
  subtotal: number;
  urgencyFee: number;
  finalBill: number;
}

export interface IDesigner {
  id: string;
  name: string;
  email: string;
}

export interface IDelivery {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  clinic_name?: string;
  doctor_name?: string;
  accountType: string;
  tin_number?: string;
  resetCode?: string;
  pos_type: string;
  licensePath: string;
  assigned_orders: string[];
  totalOutstandingBill: number;
  totalPaidBill: number;
  is_approved: false;
  client_status: string;
  employee_status: string;
}
export interface OrderDetail {
  selectedTooth: number[];
  type: string;
}

export interface DataRow {
  isDelivered: any;
  _id: string;
  id: string;
  isAccepted: boolean;
  isScanned: boolean;
  isMilled: boolean;
  isDesigned: boolean;
  isStained: boolean;
  status: string;
  email: string;
  clientId: string;
  prod_name: string;
  category: string;
  prodId: string;
  discount: string;
  rx_date: string;
  due_date: string;
  isUrgent: boolean;
  finalBill: number;
  patient_name: string;
  doctor_name: string;
  address: string;
  clinic_name: string;
  phone_number: string;
  doctor_instruction: string;
  order_detail: OrderDetail[];
}
