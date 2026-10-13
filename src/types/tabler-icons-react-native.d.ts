declare module '@tabler/icons-react-native/*' {
  import type { ForwardRefExoticComponent } from 'react';
  import type { SvgProps } from 'react-native-svg';

  type IconProps = SvgProps & {
    size?: string | number;
    strokeWidth?: string | number;
    title?: string;
  };

  const Icon: ForwardRefExoticComponent<IconProps>;

  export default Icon;
}
