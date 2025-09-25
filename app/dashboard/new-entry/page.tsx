'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function NewEntryPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    entryNumber: '',
    description: '',
    accountingPeriod: '',
    discoveryDate: '',
    errorOriginPeriod: '',
    monetaryAmount: '',
    accountsAffected: '',
    quantitativeThreshold: '',
    qualitativeFactors: '',
    isOutOfPeriod: false,
    ironCurtainAmount: '',
    rolloverAmount: '',
    resolutionMethod: 'Out-of-Period Adjustment',
    notes: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          monetaryAmount: parseFloat(formData.monetaryAmount) || 0,
          quantitativeThreshold: parseFloat(formData.quantitativeThreshold) || 0,
          ironCurtainAmount: parseFloat(formData.ironCurtainAmount) || 0,
          rolloverAmount: parseFloat(formData.rolloverAmount) || 0,
          discoveryDate: new Date(formData.discoveryDate),
          preparedBy: session?.user?.name || 'Unknown',
          accountsAffected: JSON.stringify([formData.accountsAffected]),
          qualitativeFactors: JSON.stringify([formData.qualitativeFactors]),
        })
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        console.error('Failed to create entry')
      }
    } catch (error) {
      console.error('Error creating entry:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New SAB 99 Entry</h1>
        <p className="text-gray-600 mt-2">Create a new materiality assessment and out-of-period adjustment entry</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="entryNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Entry Number *
              </label>
              <input
                type="text"
                id="entryNumber"
                name="entryNumber"
                required
                value={formData.entryNumber}
                onChange={handleInputChange}
                className="input-field"
                placeholder="SAB99-2024-001"
              />
            </div>
            
            <div>
              <label htmlFor="accountingPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                Accounting Period *
              </label>
              <input
                type="text"
                id="accountingPeriod"
                name="accountingPeriod"
                required
                value={formData.accountingPeriod}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Q4 2023"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Describe the misstatement or adjustment..."
              />
            </div>
            
            <div>
              <label htmlFor="discoveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Discovery Date *
              </label>
              <input
                type="date"
                id="discoveryDate"
                name="discoveryDate"
                required
                value={formData.discoveryDate}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            
            <div>
              <label htmlFor="errorOriginPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                Error Origin Period *
              </label>
              <input
                type="text"
                id="errorOriginPeriod"
                name="errorOriginPeriod"
                required
                value={formData.errorOriginPeriod}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Q3 2023"
              />
            </div>
          </div>
        </div>

        {/* Financial Impact */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Financial Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="monetaryAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Monetary Amount *
              </label>
              <input
                type="number"
                id="monetaryAmount"
                name="monetaryAmount"
                required
                step="0.01"
                value={formData.monetaryAmount}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label htmlFor="quantitativeThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                Quantitative Threshold
              </label>
              <input
                type="number"
                id="quantitativeThreshold"
                name="quantitativeThreshold"
                step="0.01"
                value={formData.quantitativeThreshold}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Materiality threshold amount"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="accountsAffected" className="block text-sm font-medium text-gray-700 mb-1">
                Accounts Affected
              </label>
              <input
                type="text"
                id="accountsAffected"
                name="accountsAffected"
                value={formData.accountsAffected}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g., Revenue, Accounts Receivable"
              />
            </div>
          </div>
        </div>

        {/* Out-of-Period Assessment */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Out-of-Period Assessment</h2>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isOutOfPeriod"
                checked={formData.isOutOfPeriod}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">This is an out-of-period adjustment</span>
            </label>
          </div>
          
          {formData.isOutOfPeriod && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="ironCurtainAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Iron Curtain Amount
                </label>
                <input
                  type="number"
                  id="ironCurtainAmount"
                  name="ironCurtainAmount"
                  step="0.01"
                  value={formData.ironCurtainAmount}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Balance sheet impact"
                />
              </div>
              
              <div>
                <label htmlFor="rolloverAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Rollover Amount
                </label>
                <input
                  type="number"
                  id="rolloverAmount"
                  name="rolloverAmount"
                  step="0.01"
                  value={formData.rolloverAmount}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Income statement impact"
                />
              </div>
            </div>
          )}
        </div>

        {/* Resolution */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Resolution</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="resolutionMethod" className="block text-sm font-medium text-gray-700 mb-1">
                Resolution Method *
              </label>
              <select
                id="resolutionMethod"
                name="resolutionMethod"
                required
                value={formData.resolutionMethod}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="Out-of-Period Adjustment">Out-of-Period Adjustment</option>
                <option value="Restatement">Restatement</option>
                <option value="No Action Required">No Action Required</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="qualitativeFactors" className="block text-sm font-medium text-gray-700 mb-1">
                Qualitative Factors
              </label>
              <textarea
                id="qualitativeFactors"
                name="qualitativeFactors"
                rows={3}
                value={formData.qualitativeFactors}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Describe any qualitative factors that may affect materiality..."
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Any additional documentation or notes..."
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Entry'}
          </button>
        </div>
      </form>
    </div>
  )
}