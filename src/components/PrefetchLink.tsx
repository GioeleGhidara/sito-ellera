import { Link, LinkProps } from "react-router-dom";

interface Props extends LinkProps {
  prefetch: () => Promise<unknown>;
}

export default function PrefetchLink({ prefetch, ...props }: Props) {
  return <Link onMouseEnter={prefetch} {...props} />;
}
