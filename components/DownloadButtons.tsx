import { DownloadIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { ImageService } from "../services/image-service";
import { useChart } from "./chord/useChart";
import { GA } from "../services/google-analytics";
import { T } from "@magic-translate/react";

const downloadPng =
  (chartDom: HTMLDivElement | null, width: number, title?: string) => () => {
    if (!chartDom || !chartDom.firstChild) {
      return;
    }

    GA()?.("event", "image_download", {
      value: width,
    });

    const svg = chartDom.firstChild as SVGElement;
    ImageService.downloadPng(svg, width, title);
  };

const downloadSvg = (chartDom: HTMLDivElement | null, title?: string) => () => {
  if (!chartDom) {
    return;
  }

  const svg = chartDom.innerHTML;
  ImageService.downloadSvg(svg, title);
};

interface IProps {
  title?: string;
}

// size multipliers (1 => original size)
const pngSizeMultipliers: { multiplier: number; name: string }[] = [

  {
    multiplier: 2,
    name: "Large",
  },

];

export const DownloadButtons = ({ title }: IProps) => {
  const { ref, size } = useChart();

  return (
    <Box mt={8} id="download">
      <Heading as="h2" size="lg" mb={3}>
      </Heading>
      <Flex gap={3} wrap="wrap">
      {pngSizeMultipliers.map(({ multiplier, name }) => {
          const width = Math.round(size.width * multiplier);
          const height = Math.round(size.height * multiplier);

          return (
            <Button
              display="flex"
              gap={2}
              key={multiplier}
              onClick={downloadPng(ref.current, width, title)}
            >
              <DownloadIcon />
              <T>DOWNLOAD PNG</T> 
            </Button>
          );
        })}
      <Button
          
          display="flex"
          gap={2}
          onClick={downloadSvg(ref.current, title)}
        >
          <DownloadIcon />
          DOWNLOAD SVG
      </Button>  

        
      </Flex>
    </Box>
  );
};
