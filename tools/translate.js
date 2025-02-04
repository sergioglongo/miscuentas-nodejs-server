
export const translatePayMethod = (payMethod) => {
  const methodsList = [
    { id: 'debit', name: 'Debito' },
    { id: 'credit', name: 'Credito' },
    { id: 'transfer', name: 'Transferencia' },
    { id: 'other', name: 'Otro' },
  ]
  return methodsList.find((method) => method.id === payMethod)?.name;
}