import type { Card } from "scryfall-api";

export interface ForestSpinnerProps {
  forests: Card[];
  spec: 'inner' | 'outer'
}
export const ForestSpinner = ({ forests, spec }: ForestSpinnerProps) => {
  return <div class={['spinner-holder', spec].join(' ')}>
    {
      forests.slice(0, 30).map((f, id) => {
        const image = f.image_uris
          ? f.image_uris.normal
          : f.card_faces?.[0]?.image_uris?.normal;
        return (
        <div class="spinner-rotator" style={{
            animationDelay: `-${2*id}s`,
        }}>
          <div class='spinner-card' style={{
            backgroundImage: `url(${image})`,
          }}></div>
        </div>);
      })
    }
  </div>
}