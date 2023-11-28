import React from "react";
import "./Formula.css";
import { RiEqualFill } from "react-icons/ri"
import { PiCalculator } from "react-icons/pi";;
// FormulaComponentProps
// we pass in value for the formula
// and the value for the current result
type FormulaProps = {
  formulaString: string;
  resultString: string;
}; // interface FormulaProps

const Formula: React.FC<FormulaProps> = ({ formulaString, resultString }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>
          <PiCalculator size={32} style={{ color: "white" }}/>
          </td>
          <td>
            <div className="formula">
              <span data-testid="FormulaValue">{formulaString} </span>
            </div>
          </td>
        </tr>
        <tr>
          <td>
          <RiEqualFill size={32} style={{ color: "white" }}/>
          </td>
          <td>
            <div className="formula">
              <span data-testid="FormulaResult">{resultString}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
export default Formula;
