import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";

export const useNavBlocker = ({ onBlock, enabled }) => {
  const { block } = useContext(UNSAFE_NavigationContext).navigator;

  // Latest ref pattern
  // Latest version of the function stored to the onBlockRef
  const onBlockRef = useRef(onBlock);
  useLayoutEffect(() => {
    onBlockRef.current = onBlock;
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isActive = false;

    const unblock = block(({ retry }) => {
      if (isActive) {
        unblock();
        // Retry method handles navigation for us 🎉
        // Allows to simplify code even more.
        return retry();
      }

      // This doesn't need to be included in dependencies
      // and won't trigger useEffect
      onBlockRef.current({
        confirm: retry,
        cancel: () => {
          isActive = false;
        },
      });

      isActive = true;
    });

    return unblock;
  }, [block, enabled]);
};
