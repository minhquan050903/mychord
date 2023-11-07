import { Button,Box } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useCallback, useRef, useState } from "react";
import { ColorResult } from "react-color";
import SketchPicker from "react-color/lib/components/sketch/Sketch";
import { useEscHandler } from "../../hooks/use-esc-handler";
import { useOutsideHandler } from "../../hooks/use-outside-click";
import { useChart } from "../chord/useChart";

const ColorPickerContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ColorPreview = styled.span<{ color?: string }>`
  width: 1em;
  height: 1em;
  border: 2px solid #ced4da;
  border-radius: 5px;
  margin-right: 10px;
  display: inline-block;
  background-color: ${(props) => props.color || "#000"};
`;

const ColorPreviewButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ColorChoices = styled.div`
  display: flex;
  gap: 10px;
`;

const PastelColors = [
  "#000000",
  "#F6CAB7",
  "#FFC8A5",
  "#FFF4CE",
  "#CDEDCE",
  "#D4A5A5",
  "#B9D8E4",
  "#D1C5E1",
];

interface Props {
  onChange: (color: string) => void;
  value?: string;
  render?: (props: ChildProps) => React.ReactNode;
}

interface ChildProps {
  value?: string;
  onClick: () => void;
}

export const ColorInput = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideHandler(ref, () => setVisible(false));

  const escHandler = useCallback(() => setVisible(false), []);
  useEscHandler(escHandler);
  const { setChart, chart } = useChart();
  const onColorChange = ({ hex }: ColorResult) => {
    props.onChange(hex);
  };

  return (
    <ColorPickerContainer>
      {props.render ? (
        props.render({
          value: props.value,
          onClick: () => setVisible(!visible),
        })
      ) : (
        <ColorPreviewButton
          variant="outline-dark"
          onClick={() => setVisible(!visible)}
        >
          <ColorPreview color={props.value} />
          Select Color...
        </ColorPreviewButton>
      )}

      {visible && (
        <div ref={ref}>
          <Box>
            <ColorChoices>
            {PastelColors.map((color) => (
              <ColorPreview
                key={color}
                color={color}
                onClick={() => {

                  props.onChange(color);
                  if(color != 'black'){
                    
                  }
                  setVisible(false);
                }}
              />
            ))}
          </ColorChoices>
          </Box>
          
        </div>
      )}
    </ColorPickerContainer>
  );
};
