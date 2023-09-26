import { RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Center,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Link,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { T, useT } from "@magic-translate/react";
import type { NextPage } from "next";
import React, { useCallback } from "react";
import { Orientation } from "svguitar";
import { ChordEditor } from "../components/chord/ChordEditor";
import { ChordResult } from "../components/chord/ChordResult";
import { useChart } from "../components/chord/useChart";
import { AdjustableChordSettings, ChordForm } from "../components/ChordForm";
import { DownloadButtons } from "../components/DownloadButtons";
import { ShareButtons } from "../components/ShareButtons";
import { useIsClient } from "../hooks/use-is-client";
import { useResizeHandler } from "../hooks/use-resize-handler";
import { GA } from "../services/google-analytics";

const Home: NextPage = () => {
  const t = useT();
  const { width, height } = useResizeHandler();
  const borderColor = useColorModeValue("black", "white");
  const { setChart, chart } = useChart();

  const isClient = useIsClient();

  const onSettings = useCallback(
    (newSettings: AdjustableChordSettings) =>
      setChart({
        chord: chart.chord,
        settings: {
          ...chart.settings,
          ...newSettings,
        },
      }),
    [chart.chord, chart.settings, setChart],
  );

  return (
    <>
        
          <Grid 
            templateColumns={[
              "1fr 2fr",
            ]}
            gap={6}
            mt={8}
            
          >
            <GridItem>
              <ChordForm settings={chart.settings} onSettings={onSettings} />
            </GridItem>
            <GridItem>
              <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(2, 1fr)",
            ]}
            gap={6}
            mt={8}
          >
            <GridItem
              borderRadius="xl"
              borderColor="primary"
              borderStyle="solid"
              borderWidth="2px"
              display="block"
            >
              <Box p={3} id="editor" position="relative">
              <Flex 
              as="h2"
              mb={5}
              mt={5}
              alignItems="center" 
              justify="center">
                  <T>EDITOR</T>
              </Flex>
                <Center>
                  <ChordEditor
                    numFrets={chart.settings.frets ?? 5}
                    numStrings={chart.settings.strings ?? 6}
                    chord={chart.chord}
                    settings={chart.settings}
                    onChart={setChart}
                    width={width * 0.9}
                    height={height * 0.6}
                  />
                </Center>
              </Box>
            </GridItem>
            <GridItem
              borderRadius="xl"
              borderColor={borderColor}
              borderStyle="solid"
              borderWidth="2px"
              display="block"
            >
              <Box p={3} id="result" height="100%" position="relative">
                <Heading
                  as="h2"
                  size="md"
                  transformOrigin="0 0"
                  top={8}
                  left={-2}
                  display="inline-block"
                >
                  <T>Result</T>
                </Heading>
               
                <ChordResult />
              </Box>
            </GridItem>
          </Grid>
       
    
    
        
          <DownloadButtons  title={chart.settings.title} />
      

      
            </GridItem>
      
      </Grid>
          
          
    </>
  );
};

export default Home;
