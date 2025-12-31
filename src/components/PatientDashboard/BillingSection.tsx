import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, FileText, Download, Printer, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Invoice, Payment, PaymentPlan, InsuranceInfo } from '../../types';

interface BillingSectionProps {
  invoices: Invoice[];
  payments: Payment[];
  paymentPlans: PaymentPlan[];
  insuranceInfo: InsuranceInfo[];
  onPayInvoice: (invoiceId: string) => void;
  onDownloadInvoice: (invoiceId: string) => void;
  onPrintInvoice: (invoiceId: string) => void;
  onSetupPaymentPlan: (invoiceId: string) => void;
  onAddInsurance: () => void;
}

const BillingSection = ({
  invoices,
  payments,
  paymentPlans,
  insuranceInfo,
  onPayInvoice,
  onDownloadInvoice,
  onPrintInvoice,
  onSetupPaymentPlan,
  onAddInsurance
}: BillingSectionProps) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'plans' | 'insurance'>('invoices');

  const unpaidInvoices = invoices.filter(inv => inv.status === 'unpaid' || inv.status === 'partial');
  const totalOutstanding = unpaidInvoices.reduce((sum, inv) => sum + inv.balance, 0);
  const overdueInvoices = unpaidInvoices.filter(inv => inv.status === 'overdue');

  const activePaymentPlans = paymentPlans.filter(plan => plan.status === 'active');
  const activeInsurance = insuranceInfo.filter(ins => ins.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Billing & Payments</h1>
          <p className="text-gray-600 mt-1">Manage your payments and insurance</p>
        </div>
      </div>

      {/* Outstanding Balance Alert */}
      {totalOutstanding > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${
            overdueInvoices.length > 0 ? 'bg-red-50 border-red-500' : 'bg-amber-50 border-amber-500'
          } border-l-4 rounded-lg p-6`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className={overdueInvoices.length > 0 ? 'text-red-600' : 'text-amber-600'} size={24} />
              <div>
                <h3 className={`text-lg font-bold ${overdueInvoices.length > 0 ? 'text-red-800' : 'text-amber-800'} mb-1`}>
                  Outstanding Balance: ${totalOutstanding.toFixed(2)}
                </h3>
                <p className={overdueInvoices.length > 0 ? 'text-red-600' : 'text-amber-600'}>
                  {overdueInvoices.length > 0 
                    ? `${overdueInvoices.length} overdue invoice${overdueInvoices.length > 1 ? 's' : ''}`
                    : `${unpaidInvoices.length} unpaid invoice${unpaidInvoices.length > 1 ? 's' : ''}`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => unpaidInvoices.length === 1 ? onPayInvoice(unpaidInvoices[0].id) : setActiveTab('invoices')}
              className={`px-6 py-3 ${
                overdueInvoices.length > 0 ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
              } text-white rounded-lg transition font-semibold`}
            >
              Pay Now
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <DollarSign className="mb-2" size={32} />
          <p className="text-3xl font-bold">${totalOutstanding.toFixed(2)}</p>
          <p className="text-purple-100">Outstanding</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <CheckCircle className="mb-2" size={32} />
          <p className="text-3xl font-bold">{invoices.filter(i => i.status === 'paid').length}</p>
          <p className="text-green-100">Paid Invoices</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Clock className="mb-2" size={32} />
          <p className="text-3xl font-bold">{activePaymentPlans.length}</p>
          <p className="text-purple-100">Active Plans</p>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <CreditCard className="mb-2" size={32} />
          <p className="text-3xl font-bold">{activeInsurance.length}</p>
          <p className="text-indigo-100">Insurance Plans</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-wrap border-b">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
              activeTab === 'invoices' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText size={20} />
            Invoices
            {unpaidInvoices.length > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">{unpaidInvoices.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
              activeTab === 'payments' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <DollarSign size={20} />
            Payment History
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
              activeTab === 'plans' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Clock size={20} />
            Payment Plans
          </button>
          <button
            onClick={() => setActiveTab('insurance')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
              activeTab === 'insurance' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CreditCard size={20} />
            Insurance
          </button>
        </div>

        <div className="p-6">
          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              {invoices.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText size={64} className="mx-auto mb-4 opacity-50" />
                  <p>No invoices yet</p>
                </div>
              ) : (
                invoices.map((invoice) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-800">{invoice.invoice_number}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            invoice.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {invoice.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Invoice Date</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(invoice.invoice_date).toLocaleDateString()}
                            </p>
                          </div>
                          {invoice.due_date && (
                            <div>
                              <p className="text-sm text-gray-500">Due Date</p>
                              <p className="font-semibold text-gray-800">
                                {new Date(invoice.due_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-bold text-gray-800">${invoice.total_amount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Balance Due</p>
                            <p className={`font-bold ${invoice.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              ${invoice.balance.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {invoice.items && invoice.items.length > 0 && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-semibold text-gray-700 mb-2">Items:</p>
                            <div className="space-y-2">
                              {invoice.items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    {item.description} x{item.quantity}
                                  </span>
                                  <span className="font-semibold text-gray-800">
                                    ${item.total_price.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {invoice.notes && (
                          <p className="text-sm text-gray-600 mt-3">
                            <span className="font-semibold">Notes:</span> {invoice.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 md:w-48">
                        {invoice.balance > 0 && (
                          <>
                            <button
                              onClick={() => onPayInvoice(invoice.id)}
                              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                            >
                              Pay ${invoice.balance.toFixed(2)}
                            </button>
                            <button
                              onClick={() => onSetupPaymentPlan(invoice.id)}
                              className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition font-semibold text-sm"
                            >
                              Payment Plan
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onDownloadInvoice(invoice.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                        >
                          <Download size={18} />
                          Download
                        </button>
                        <button
                          onClick={() => onPrintInvoice(invoice.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                        >
                          <Printer size={18} />
                          Print
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Payment History Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              {payments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <DollarSign size={64} className="mx-auto mb-4 opacity-50" />
                  <p>No payment history yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div>
                        <p className="font-semibold text-gray-800">Payment - ${payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(payment.payment_date).toLocaleDateString()} • {payment.payment_method.replace('_', ' ').toUpperCase()}
                        </p>
                        {payment.transaction_id && (
                          <p className="text-xs text-gray-500 mt-1">Transaction ID: {payment.transaction_id}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Payment Plans Tab */}
          {activeTab === 'plans' && (
            <div className="space-y-4">
              {paymentPlans.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock size={64} className="mx-auto mb-4 opacity-50" />
                  <p>No payment plans yet</p>
                  <p className="text-sm mt-2">Set up a payment plan to spread costs over time</p>
                </div>
              ) : (
                paymentPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Payment Plan</h3>
                        <p className="text-gray-600">
                          {plan.installments_completed} of {plan.number_of_installments} payments completed
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        plan.status === 'completed' ? 'bg-green-100 text-green-800' :
                        plan.status === 'active' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {plan.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-bold text-gray-800">${plan.total_amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount Paid</p>
                        <p className="font-bold text-green-600">${plan.amount_paid.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Remaining</p>
                        <p className="font-bold text-purple-600">${plan.remaining_balance.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Installment</p>
                        <p className="font-bold text-gray-800">${plan.installment_amount.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-gray-800">
                          {Math.round((plan.amount_paid / plan.total_amount) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-3">
                        <div
                          className="bg-purple-600 rounded-full h-3 transition-all duration-500"
                          style={{ width: `${(plan.amount_paid / plan.total_amount) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {plan.next_payment_date && plan.status === 'active' && (
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-purple-800">Next Payment Due</p>
                          <p className="text-purple-600">{new Date(plan.next_payment_date).toLocaleDateString()}</p>
                        </div>
                        <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
                          Pay ${plan.installment_amount.toFixed(2)}
                        </button>
                      </div>
                    )}

                    {plan.installments && plan.installments.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold text-gray-700 mb-3">Payment Schedule:</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {plan.installments.map((installment) => (
                            <div key={installment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                  installment.status === 'paid' ? 'bg-green-500 text-white' :
                                  installment.status === 'overdue' ? 'bg-red-500 text-white' :
                                  'bg-gray-300 text-gray-600'
                                }`}>
                                  {installment.installment_number}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">
                                    ${installment.amount_due.toFixed(2)}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Due: {new Date(installment.due_date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                installment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                installment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {installment.status.toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Insurance Tab */}
          {activeTab === 'insurance' && (
            <div className="space-y-4">
              {insuranceInfo.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CreditCard size={64} className="mx-auto mb-4 opacity-50" />
                  <p>No insurance information on file</p>
                  <button
                    onClick={onAddInsurance}
                    className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Add Insurance Information
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-end">
                    <button
                      onClick={onAddInsurance}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                    >
                      Add New Insurance
                    </button>
                  </div>
                  
                  {insuranceInfo.map((insurance) => (
                    <motion.div
                      key={insurance.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{insurance.provider_name}</h3>
                          <p className="text-gray-600">Policy #{insurance.policy_number}</p>
                          {insurance.is_primary && (
                            <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                              Primary Insurance
                            </span>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          insurance.status === 'active' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {insurance.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {insurance.group_number && (
                          <div>
                            <p className="text-sm text-gray-500">Group Number</p>
                            <p className="font-semibold text-gray-800">{insurance.group_number}</p>
                          </div>
                        )}
                        {insurance.subscriber_name && (
                          <div>
                            <p className="text-sm text-gray-500">Subscriber</p>
                            <p className="font-semibold text-gray-800">{insurance.subscriber_name}</p>
                          </div>
                        )}
                        {insurance.coverage_start_date && (
                          <div>
                            <p className="text-sm text-gray-500">Coverage Start</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(insurance.coverage_start_date).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {insurance.coverage_details && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Coverage Details:</p>
                          <p className="text-sm text-gray-600">{insurance.coverage_details}</p>
                        </div>
                      )}

                      {(insurance.card_front_url || insurance.card_back_url) && (
                        <div className="flex gap-4">
                          {insurance.card_front_url && (
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 mb-2">Card Front</p>
                              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                                <CreditCard className="text-gray-400" size={48} />
                              </div>
                            </div>
                          )}
                          {insurance.card_back_url && (
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 mb-2">Card Back</p>
                              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                                <CreditCard className="text-gray-400" size={48} />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingSection;
