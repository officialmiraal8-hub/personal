import MintPoints from '../MintPoints'

export default function MintPointsExample() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <MintPoints
        currentPoints={5000}
        onMint={(amount) => console.log('Minting', amount, 'XLM')}
      />
    </div>
  )
}
