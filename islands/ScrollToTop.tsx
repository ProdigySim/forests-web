import { useSignal, useSignalEffect } from '@preact/signals';
import { useCallback } from 'preact/hooks';
export function ScrollToTop() {
  const showGoTop = useSignal( false )

  const handleVisibleButton = useCallback(() => {
      showGoTop.value = globalThis.pageYOffset > 50;
  }, [showGoTop]);

  const handleScrollUp = () => {
      globalThis.scrollTo( { left: 0, top: 0, behavior: 'smooth' } )
  };

  useSignalEffect( () => {
      globalThis.addEventListener( 'scroll', handleVisibleButton )
  })

  return (
      <div className={ showGoTop.value ? 'scrollToTop visible' :'scrollToTop' } onClick={ handleScrollUp }>
          <button type='button' className='gototop'>
              <span>^ Top</span>
          </button>
      </div>
  )
}