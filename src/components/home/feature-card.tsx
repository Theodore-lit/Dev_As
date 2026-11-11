/**
 * FeatureCard Component
 * 
 * Server Component that displays a feature card with icon, title, and optional description.
 * Uses design system styling (.card.soft, .ico) for consistent appearance.
 * 
 * Props:
 * - icon: string (emoji or icon character to display in circle)
 * - title: string (h3 heading for the feature)
 * - description?: string (optional paragraph describing the feature)
 */

interface FeatureCardProps {
  icon: string;
  title: string;
  description?: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="card soft">
      <div className="stack">
        {/* Icon circle with green-pale background */}
        <div className="ico">{icon}</div>

        {/* Title heading */}
        <h3>{title}</h3>

        {/* Optional description paragraph */}
        {description && <p className="mute">{description}</p>}
      </div>
    </div>
  );
}
