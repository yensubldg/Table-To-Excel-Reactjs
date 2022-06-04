import { ReactElement } from "react";
import { UseExport } from "./use-export";

export interface IProps extends UseExport {
  children: ReactElement | ReactElement[];
}
