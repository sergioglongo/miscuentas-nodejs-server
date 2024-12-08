export const payMethodsInitials = [
  {
    name: 'Dinero en Efectivo',
    type: 'out',
    method: 'cash',
    account: 'Efectivo',
    accountId: null,
    default: true
  },
  {
    name: 'Dinero en Efectivo',
    type: 'in',
    method: 'cash',
    account: 'Efectivo',
    accountId: null,
    default: true
  },
  {
    name: 'Tarjeta Debito',
    type: 'out',
    method: 'debit',
    account: 'Cuenta Banco',
    accountId: null,
    default: true
  },
  {
    name: 'Transferencia',
    type: 'out',
    method: 'transfer',
    account: 'Cuenta Banco',
    accountId: null,
    default: true
  },
  {
    name: 'Transferencia',
    type: 'in',
    method: 'transfer',
    account: 'Cuenta Banco',
    accountId: null,
    default: true
  },
  {
    name: 'Tarjeta Credito',
    type: 'out',
    method: 'credit',
    account: 'Cuenta Banco',
    excluded: true,
    accountId: null,
    default: true
  },
  {
    name: 'Tarjeta Debito',
    type: 'out',
    method: 'debit',
    account: 'Cuenta Electronica',
    accountId: null,
    default: true
  },
  {
    name: 'Transferencia',
    type: 'out',
    method: 'transfer',
    account: 'Cuenta Electronica',
    accountId: null,
    default: true
  },
  {
    name: 'Transferencia',
    type: 'in',
    method: 'transfer',
    account: 'Cuenta Electronica',
    accountId: null,
    default: true
  },
]