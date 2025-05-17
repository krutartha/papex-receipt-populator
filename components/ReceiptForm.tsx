import { useState, useEffect } from 'react';
import { useForm, Controller, Control, FieldValues, useFieldArray, useWatch } from 'react-hook-form';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface LineItem {
  id: string;
  orderRef: {
    id: string;
  };
  item: {
    id: string;
  };
  name: string;
  price: number;
  printed: boolean;
  createdTime: number;
  orderClientCreatedTime: number;
  exchanged: boolean;
  refunded: boolean;
  isRevenue: boolean;
  isOrderFee: boolean;
}

interface ReceiptFormData {
  userId: string;
  orderId: string;
  merchantName: string;
  total: number;
  merchantId: string;
  currency: string;
  lineItems: LineItem[];
}

interface ControlledFieldProps {
  field: {
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    value: any;
    name: string;
    ref: React.Ref<any>;
  };
}

// Function to generate a random ID similar to Firebase's auto-generated IDs
function generateId(length = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function calculateTotal(items: Array<{ price?: number }>) {
  return items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
}

export default function ReceiptForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lineItemCount, setLineItemCount] = useState(1);
  const [autoOrderId] = useState(() => generateId());
  const [autoMerchantId] = useState(() => generateId());
  const { user } = useAuth(); // Get the current user from auth context

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ReceiptFormData>({
    defaultValues: {
      userId: user?.uid || '', // Use the authenticated user's ID
      currency: 'USD',
      orderId: autoOrderId,
      merchantId: autoMerchantId,
      total: 0,
      lineItems: [
        {
          printed: false,
          exchanged: false,
          refunded: false,
          isRevenue: true,
          isOrderFee: false,
        } as LineItem,
      ],
    },
  });

  // Watch line items for price changes
  const lineItems = watch('lineItems');
  
  // Update total whenever line items change
  useEffect(() => {
    const total = calculateTotal(lineItems);
    setValue('total', total);
  }, [lineItems, setValue]);

  const onSubmit = async (data: ReceiptFormData) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      // Calculate final total from line items
      const finalTotal = data.lineItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
      
      // Add timestamps
      const now = Date.now();
      const receipt = {
        ...data,
        userId: user.uid,
        total: finalTotal, // Ensure total matches line items
        createdAt: now,
        lastModified: now,
        paymentStatus: 'locked',
        success: true,
        lineItems: data.lineItems.map((item, index) => ({
          ...item,
          id: `ITEM${index + 1}${now}`,
          orderRef: { id: data.orderId },
          item: { id: `PROD${index + 1}${now}` },
          createdTime: now,
          orderClientCreatedTime: now,
        })),
      };

      const docRef = await addDoc(collection(db, 'receipts'), receipt);
      console.log('Receipt created with ID:', docRef.id);
      
      // Generate new IDs for next receipt
      const newOrderId = generateId();
      const newMerchantId = generateId();
      
      reset({
        userId: user.uid,
        currency: 'USD',
        orderId: newOrderId,
        merchantId: newMerchantId,
        total: 0,
        lineItems: [
          {
            printed: false,
            exchanged: false,
            refunded: false,
            isRevenue: true,
            isOrderFee: false,
          } as LineItem,
        ],
      });
      setLineItemCount(1);
      alert('Receipt created successfully!');
    } catch (error) {
      console.error('Error creating receipt:', error);
      alert('Error creating receipt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">PapeX Receipt Creator</h1>
        <p className="text-lg text-gray-600">Create receipts for demo purposes</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900">Merchant Name</label>
            <Controller
              name="merchantName"
              control={control}
              rules={{ required: 'Merchant name is required' }}
              render={({ field }: ControlledFieldProps) => (
                <input
                  {...field}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                />
              )}
            />
            {errors.merchantName && (
              <p className="mt-1 text-sm text-red-600">{errors.merchantName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Currency</label>
            <Controller
              name="currency"
              control={control}
              rules={{ required: 'Currency is required' }}
              render={({ field }: ControlledFieldProps) => (
                <select
                  {...field}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              )}
            />
            {errors.currency && (
              <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Line Items</h2>
          <div className="space-y-4">
            {[...Array(lineItemCount)].map((_, index) => (
              <div key={index} className="border p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium mb-3 text-gray-900">Item {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">Item Name</label>
                    <Controller
                      name={`lineItems.${index}.name`}
                      control={control}
                      rules={{ required: 'Item name is required' }}
                      render={({ field }: ControlledFieldProps) => (
                        <input
                          {...field}
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900">Price</label>
                    <Controller
                      name={`lineItems.${index}.price`}
                      control={control}
                      rules={{ required: 'Price is required', min: 0 }}
                      render={({ field }: ControlledFieldProps) => (
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={() => setLineItemCount(prev => prev + 1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Line Item
          </button>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Receipt...' : 'Create Receipt'}
          </button>
        </div>
      </form>
    </div>
  );
} 