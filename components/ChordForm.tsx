import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  QuestionIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";

import React, { useDeferredValue, useEffect, useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { ChordSettings, ChordStyle, Orientation } from "svguitar";
import { SubscriptionType } from "../types";
import { useSubscription } from "../utils/useSubscription";
import { ColorInput } from "./ColorInput";
import { SliderWithTooltip } from "./SliderWithTooltip";
import { GA } from "../services/google-analytics";
import { T, useT } from "@magic-translate/react";
import { useChart } from "../components/chord/useChart";
import { useIsClient } from "../hooks/use-is-client";

export type AdjustableChordSettings = Pick<
  ChordSettings,
  | "orientation"
  | "frets"
  | "strings"
  | "position"
  | "style"
  | "title"
  | "fretSize"
  | "fingerSize"
  | "fingerTextSize"
  | "titleFontSize"
  | "strokeWidth"
  | "color"
  | "backgroundColor"
  | "fixedDiagramPosition"
  | "noPosition"
>;

export const defaultValues: AdjustableChordSettings = {
  orientation: Orientation.horizontal,
  title: "",
  frets: 5,
  strings: 6,
  position: 1,
  style: ChordStyle.normal,
  fretSize: 1.5,
  fingerSize: 0.65,
  fingerTextSize: 24,
  strokeWidth: 2,
  titleFontSize: 48,
  backgroundColor: "white",
  color: "black",
  fixedDiagramPosition: false,
};

export const ChordForm: React.FunctionComponent<{
  onSettings(settings: AdjustableChordSettings): void;
  settings: AdjustableChordSettings;
}> = ({ onSettings, settings }) => {
  const { isOpen, onToggle } = useDisclosure();
  const subscription = useSubscription();
  const t = useT();

  const {
    register,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AdjustableChordSettings>({
    mode: "onChange",
    defaultValues: settings,
  });
  const [data, setData] = useState<AdjustableChordSettings>(settings);

  watch(setData);

  const deferredValue = useDeferredValue(data);

  useEffect(() => {
    // iterate through form data and replace invalid values with default values.
    // Unfortunately use-form-hooks always triggers the watch callback even if values are invalid
    const validData = Object.entries(deferredValue).reduce(
      (acc, [key, value]) => {
        return {
          ...acc,
          [key]:
            key in errors || (typeof value === "number" && isNaN(value))
              ? defaultValues[key as keyof AdjustableChordSettings]
              : value,
        };
      },
      {},
    ) as AdjustableChordSettings;

    onSettings(validData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredValue, errors]);

  useEffect(() => {
    setValue("orientation", settings.orientation);
  }, [setValue, settings.orientation]);

  useEffect(() => {
    if (isOpen) {
      GA()?.("event", "toggled_more_settings");
    }
  }, [isOpen]);

  const resetSettings = () => {
    GA()?.("event", "reset_settings");
    reset(defaultValues);
  };
  const { setChart, chart } = useChart();

  const isClient = useIsClient();


  return (
    <>
      <SimpleGrid columns={1} mt={10} gap={4}>
        <Box>
          <FormControl isInvalid={!!errors.title}>
            <FormLabel>
              <T>Title</T>
              <Input
                placeholder={t("Enter title")}
                {...register("title", {
                  maxLength: {
                    value: 300,
                    message: t("Title is too long."),
                  },
                })}
              />
            </FormLabel>
            {errors.title?.message && (
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            )}
          </FormControl>
        </Box>
        <Box>
          <FormControl isInvalid={!!errors.position}>
            <FormLabel>
              <T>Starting fret</T>
              <Input
                placeholder={t("Enter starting fret...")}
                {...register("position", {
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: t("Starting fret must be at least 1"),
                  },
                  max: 50,
                })}
                type="number"
              />
            </FormLabel>
            {errors.position?.message && (
              <FormErrorMessage>{errors.position?.message}</FormErrorMessage>
            )}
          </FormControl>
        </Box>
        <Box>
          <FormControl isInvalid={!!errors.frets}>
            <FormLabel>
              <T>Number of frets</T>
              <Input
                placeholder={t("Number of frets...")}
                {...register("frets", {
                  valueAsNumber: true,
                  min: {
                    value: 5,
                    message: "Must have at least 5 fret",
                  },
                  max: {
                    value: 25,
                    message: "Too many frets!",
                  },
                })}
                type="number"
              />
            </FormLabel>
            {errors.frets?.message && (
              <FormErrorMessage>{errors.frets?.message}</FormErrorMessage>
            )}
          </FormControl>
        </Box>

         
          <Box>
            <FormControl>
              <FormLabel>
                <T>Frets height</T>
                <Controller
                  control={control}
                  name="fretSize"
                  render={({ field }) => (
                    <SliderWithTooltip
                      aria-label="Chord chart height"
                      min={0.7}
                      max={5}
                      step={0.05}
                      {...field}
                    />
                  )}
                ></Controller>
              </FormLabel>
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>
                <T>Finger size</T>
                <Controller
                  control={control}
                  name="fingerSize"
                  render={({ field }) => (
                    <SliderWithTooltip
                      aria-label="Chord chart finger size"
                      min={0.5}
                      max={2}
                      step={0.01}
                      {...field}
                    />
                  )}
                ></Controller>
              </FormLabel>
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>
                <T>Finger font size</T>
                <Controller
                  control={control}
                  name="fingerTextSize"
                  render={({ field }) => (
                    <SliderWithTooltip
                      aria-label="Chord chart finger text size"
                      min={10}
                      max={50}
                      step={1}
                      {...field}
                    />
                  )}
                ></Controller>
              </FormLabel>
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>
                <T>Title font size</T>
                <Controller
                  control={control}
                  name="titleFontSize"
                  render={({ field }) => (
                    <SliderWithTooltip
                      aria-label="Title font size"
                      min={5}
                      max={250}
                      step={1}
                      {...field}
                    />
                  )}
                ></Controller>
              </FormLabel>
            </FormControl>
          </Box>
        
         
          <Box></Box>
          <Flex alignItems="center" justify="center">
            <FormLabel as="div">
              <Button
                display="flex"
                gap={2}
                onClick={resetSettings}
              >
                <DeleteIcon />
                <T>Reset settings</T>
              </Button>
            </FormLabel>
            
                  
               
          </Flex>
          <Flex alignItems="center" justify="center">
            <FormLabel as="div">
            <Button
          display="flex"

          aria-label={t("Rotate chord diagram")}
          
          onClick={() => {
            GA()?.("event", "rotate_chord_diagram");
            setChart({
              ...chart,
              settings: {
                ...chart.settings,
                orientation:
                  chart.settings.orientation ===
                  Orientation.horizontal
                    ? Orientation.vertical
                    : Orientation.horizontal,
              },
            });
          }}
          >Rotate</Button>
            </FormLabel>
            
                  
               
          </Flex>
          
          
          
          

      </SimpleGrid>

      
    </>
  );
};
