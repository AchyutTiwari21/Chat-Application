//@ts-ignore
export default function FeatureCard({ icon, title, description }) {
    return (
      <div className="bg-card p-6 rounded-lg border hover:shadow-lg transition-shadow">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    );
}