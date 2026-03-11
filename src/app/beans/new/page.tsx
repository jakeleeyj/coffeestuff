import BeanForm from '@/components/beans/BeanForm'

export default function NewBeanPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-coffee-900 mb-6">Add a bean</h1>
      <BeanForm />
    </div>
  )
}
