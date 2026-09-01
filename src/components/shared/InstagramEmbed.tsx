import { InstagramEmbed as ReactInstagramEmbed } from "react-social-media-embed";

interface InstagramEmbedProps {
  url: string;
}

const InstagramEmbed = ({ url }: InstagramEmbedProps) => {
  // Ensure the URL doesn't have query params if it's causing issues, 
  // though react-social-media-embed handles standard URLs perfectly.
  const cleanUrl = url.split("?")[0].replace(/\/$/, "");

  return (
    <div className="flex justify-center w-full my-8">
      <div className="w-full max-w-[540px]">
        <ReactInstagramEmbed url={cleanUrl} width="100%" />
      </div>
    </div>
  );
};

export default InstagramEmbed;
