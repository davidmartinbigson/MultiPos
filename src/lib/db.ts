// Extended database with products, customers, staff, appointments, branches, transactions

import { prisma } from './prisma';

// Module-level in-memory storage (persists across requests in same process)
const globalForInMemory = globalThis as unknown as {
  inMemoryUsers: any[];
  inMemoryProducts: any[];
  inMemoryCustomers: any[];
  inMemoryStaff: any[];
  inMemoryAppointments: any[];
  inMemoryBranches: any[];
  inMemoryTransactions: any[];
};

if (!globalForInMemory.inMemoryUsers) {
  globalForInMemory.inMemoryUsers = [];
}
if (!globalForInMemory.inMemoryProducts) {
  globalForInMemory.inMemoryProducts = [];
}
if (!globalForInMemory.inMemoryCustomers) {
  globalForInMemory.inMemoryCustomers = [];
}
if (!globalForInMemory.inMemoryStaff) {
  globalForInMemory.inMemoryStaff = [];
}
if (!globalForInMemory.inMemoryAppointments) {
  globalForInMemory.inMemoryAppointments = [];
}
if (!globalForInMemory.inMemoryBranches) {
  globalForInMemory.inMemoryBranches = [];
}
if (!globalForInMemory.inMemoryTransactions) {
  globalForInMemory.inMemoryTransactions = [];
}

let inMemoryUsers = globalForInMemory.inMemoryUsers;
let inMemoryProducts = globalForInMemory.inMemoryProducts;
let inMemoryCustomers = globalForInMemory.inMemoryCustomers;
let inMemoryStaff = globalForInMemory.inMemoryStaff;
let inMemoryAppointments = globalForInMemory.inMemoryAppointments;
let inMemoryBranches = globalForInMemory.inMemoryBranches;
let inMemoryTransactions = globalForInMemory.inMemoryTransactions;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const db = {
  user: {
    findUnique: async (args: any) => {
      if (prisma) {
        try { return await prisma.user.findUnique(args); } catch (e) {}
      }
      return inMemoryUsers.find(u => {
        if (args.where.id && u.id === args.where.id) return true;
        if (args.where.email && u.email === args.where.email) return true;
        if (args.where.licenseKey && u.licenseKey === args.where.licenseKey) return true;
        return false;
      }) || null;
    },
    findFirst: async (args: any) => {
      if (prisma) {
        try { return await prisma.user.findFirst(args); } catch (e) {}
      }
      return inMemoryUsers.find(u => {
        if (args.where.role && u.role !== args.where.role) return false;
        if (args.where.email && u.email !== args.where.email) return false;
        return true;
      }) || null;
    },
    findMany: async (args: any = {}) => {
      if (prisma) {
        try { return await prisma.user.findMany(args); } catch (e) {}
      }
      let result = [...inMemoryUsers];
      if (args.where?.role) result = result.filter(u => u.role === args.where.role);
      return result;
    },
    create: async (args: any) => {
      if (prisma) {
        try { return await prisma.user.create(args); } catch (e) {}
      }
      const newUser = {
        id: generateId(),
        email: args.data.email,
        password: args.data.password,
        name: args.data.name || null,
        role: args.data.role || 'customer',
        businessType: args.data.businessType || null,
        businessName: args.data.businessName || null,
        isActive: args.data.isActive !== undefined ? args.data.isActive : true,
        licenseKey: args.data.licenseKey || null,
        licenseExpiry: args.data.licenseExpiry || null,
        businessPhone: args.data.businessPhone || null,
        ownerPhone: args.data.ownerPhone || null,
        country: args.data.country || null,
        currency: args.data.currency || null,
        address: args.data.address || null,
        branchCount: args.data.branchCount || 1,
        staffCount: args.data.staffCount || 1,
        posTerminals: args.data.posTerminals || 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryUsers.push(newUser);
      return newUser;
    },
    update: async (args: any) => {
      if (prisma) {
        try { return await prisma.user.update(args); } catch (e) {}
      }
      const index = inMemoryUsers.findIndex(u => u.id === args.where.id);
      if (index === -1) throw new Error('User not found');
      inMemoryUsers[index] = { ...inMemoryUsers[index], ...args.data, updatedAt: new Date() };
      return inMemoryUsers[index];
    },
    delete: async (args: any) => {
      if (prisma) {
        try { return await prisma.user.delete(args); } catch (e) {}
      }
      const index = inMemoryUsers.findIndex(u => u.id === args.where.id);
      if (index !== -1) inMemoryUsers.splice(index, 1);
    },
  },

  product: {
    findMany: async (args: any = {}) => {
      let result = [...inMemoryProducts];
      if (args.where?.userId) result = result.filter(p => p.userId === args.where.userId);
      return result;
    },
    create: async (args: any) => {
      const newProduct = {
        id: generateId(),
        userId: args.data.userId,
        name: args.data.name,
        sku: args.data.sku || `SKU-${generateId().substr(0, 6)}`,
        price: args.data.price,
        costPrice: args.data.costPrice || 0,
        stock: args.data.stock || 0,
        category: args.data.category || null,
        barcode: args.data.barcode || null,
        description: args.data.description || null,
        imageUrl: args.data.imageUrl || null,
        isActive: args.data.isActive !== undefined ? args.data.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryProducts.push(newProduct);
      return newProduct;
    },
    update: async (args: any) => {
      const index = inMemoryProducts.findIndex(p => p.id === args.where.id);
      if (index === -1) throw new Error('Product not found');
      inMemoryProducts[index] = { ...inMemoryProducts[index], ...args.data, updatedAt: new Date() };
      return inMemoryProducts[index];
    },
    delete: async (args: any) => {
      const index = inMemoryProducts.findIndex(p => p.id === args.where.id);
      if (index !== -1) inMemoryProducts.splice(index, 1);
    },
  },

  customer: {
    findMany: async (args: any = {}) => {
      let result = [...inMemoryCustomers];
      if (args.where?.userId) result = result.filter(c => c.userId === args.where.userId);
      return result;
    },
    create: async (args: any) => {
      const newCustomer = {
        id: generateId(),
        userId: args.data.userId,
        name: args.data.name,
        email: args.data.email || null,
        phone: args.data.phone || null,
        address: args.data.address || null,
        balance: args.data.balance || 0,
        isActive: args.data.isActive !== undefined ? args.data.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryCustomers.push(newCustomer);
      return newCustomer;
    },
    update: async (args: any) => {
      const index = inMemoryCustomers.findIndex(c => c.id === args.where.id);
      if (index === -1) throw new Error('Customer not found');
      inMemoryCustomers[index] = { ...inMemoryCustomers[index], ...args.data, updatedAt: new Date() };
      return inMemoryCustomers[index];
    },
    delete: async (args: any) => {
      const index = inMemoryCustomers.findIndex(c => c.id === args.where.id);
      if (index !== -1) inMemoryCustomers.splice(index, 1);
    },
  },

  staff: {
    findMany: async (args: any = {}) => {
      let result = [...inMemoryStaff];
      if (args.where?.userId) result = result.filter(s => s.userId === args.where.userId);
      return result;
    },
    create: async (args: any) => {
      const newStaff = {
        id: generateId(),
        userId: args.data.userId,
        name: args.data.name,
        role: args.data.role || 'Employee',
        email: args.data.email || null,
        phone: args.data.phone || null,
        salary: args.data.salary || 0,
        joinDate: args.data.joinDate || new Date(),
        isActive: args.data.isActive !== undefined ? args.data.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryStaff.push(newStaff);
      return newStaff;
    },
    update: async (args: any) => {
      const index = inMemoryStaff.findIndex(s => s.id === args.where.id);
      if (index === -1) throw new Error('Staff not found');
      inMemoryStaff[index] = { ...inMemoryStaff[index], ...args.data, updatedAt: new Date() };
      return inMemoryStaff[index];
    },
    delete: async (args: any) => {
      const index = inMemoryStaff.findIndex(s => s.id === args.where.id);
      if (index !== -1) inMemoryStaff.splice(index, 1);
    },
  },

  appointment: {
    findMany: async (args: any = {}) => {
      let result = [...inMemoryAppointments];
      if (args.where?.userId) result = result.filter(a => a.userId === args.where.userId);
      return result;
    },
    create: async (args: any) => {
      const newAppointment = {
        id: generateId(),
        userId: args.data.userId,
        customerName: args.data.customerName,
        service: args.data.service,
        date: args.data.date,
        time: args.data.time,
        status: args.data.status || 'scheduled',
        notes: args.data.notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryAppointments.push(newAppointment);
      return newAppointment;
    },
    update: async (args: any) => {
      const index = inMemoryAppointments.findIndex(a => a.id === args.where.id);
      if (index === -1) throw new Error('Appointment not found');
      inMemoryAppointments[index] = { ...inMemoryAppointments[index], ...args.data, updatedAt: new Date() };
      return inMemoryAppointments[index];
    },
    delete: async (args: any) => {
      const index = inMemoryAppointments.findIndex(a => a.id === args.where.id);
      if (index !== -1) inMemoryAppointments.splice(index, 1);
    },
  },

  branch: {
    findMany: async (args: any = {}) => {
      let result = [...inMemoryBranches];
      if (args.where?.userId) result = result.filter(b => b.userId === args.where.userId);
      return result;
    },
    create: async (args: any) => {
      const newBranch = {
        id: generateId(),
        userId: args.data.userId,
        name: args.data.name,
        address: args.data.address || null,
        phone: args.data.phone || null,
        isMain: args.data.isMain || false,
        isActive: args.data.isActive !== undefined ? args.data.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryBranches.push(newBranch);
      return newBranch;
    },
    update: async (args: any) => {
      const index = inMemoryBranches.findIndex(b => b.id === args.where.id);
      if (index === -1) throw new Error('Branch not found');
      inMemoryBranches[index] = { ...inMemoryBranches[index], ...args.data, updatedAt: new Date() };
      return inMemoryBranches[index];
    },
    delete: async (args: any) => {
      const index = inMemoryBranches.findIndex(b => b.id === args.where.id);
      if (index !== -1) inMemoryBranches.splice(index, 1);
    },
  },

  transaction: {
    findMany: async (args: any = {}) => {
      let result = [...inMemoryTransactions];
      if (args.where?.userId) result = result.filter(t => t.userId === args.where.userId);
      return result;
    },
    create: async (args: any) => {
      const newTransaction = {
        id: generateId(),
        userId: args.data.userId,
        invoiceNo: args.data.invoiceNo || `INV-${generateId().substr(0, 6)}`,
        items: args.data.items || [],
        subtotal: args.data.subtotal || 0,
        tax: args.data.tax || 0,
        discount: args.data.discount || 0,
        total: args.data.total || 0,
        paymentMethod: args.data.paymentMethod || 'cash',
        customerName: args.data.customerName || 'Walk-in',
        status: args.data.status || 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryTransactions.push(newTransaction);
      return newTransaction;
    },
  },
};
