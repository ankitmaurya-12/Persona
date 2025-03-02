declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    stroke?: string | number;
  }

  export type Icon = ComponentType<IconProps>;

  export const AlertCircle: Icon;
  export const Award: Icon;
  export const Briefcase: Icon;
  export const Calendar: Icon;
  export const Camera: Icon;
  export const Check: Icon;
  export const Clock: Icon;
  export const Code: Icon;
  export const Coffee: Icon;
  export const Database: Icon;
  export const ExternalLink: Icon;
  export const Eye: Icon;
  export const GitBranch: Icon;
  export const Github: Icon;
  export const GraduationCap: Icon;
  export const Heart: Icon;
  export const History: Icon;
  export const Home: Icon;
  export const Instagram: Icon;
  export const Linkedin: Icon;
  export const LogOut: Icon;
  export const MapPin: Icon;
  export const MessageSquare: Icon;
  export const Plane: Icon;
  export const Save: Icon;
  export const Search: Icon;
  export const Settings: Icon;
  export const Shield: Icon;
  export const Star: Icon;
  export const ThumbsUp: Icon;
  export const Trash2: Icon;
  export const Twitter: Icon;
  export const User: Icon;
  export const Users: Icon;
  export const X: Icon;
  export const Youtube: Icon;
} 