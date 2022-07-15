/**
 * Módulo de las expresiones matemáticas en latex para usar junto a la librería mathjax
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

 import MathJax from 'react-mathjax';

export const SCND_KIRKCHOFF     = "\\sum_{i=0}^{n} v_i = 0";
export const OHM_LAW            = "V = R \\cdot I";
export const I_DEFINITION       = "I(t) = \\frac{\\partial q(t)}{\\partial t}";
export const SUST_DEFINITION    = "\\varepsilon = R \\cdot I(t) + \\frac{q(t)}{C} = R \\cdot \\frac{\\partial q(t)}{\\partial t} + \\frac{q(t)}{C}";
export const SUST_DEFINITION2   = "R \\cdot \\frac{\\partial q(t)}{\\partial t} = \\varepsilon - \\frac{q(t)}{C}";
export const SUST_DEFINITION3   = "\\frac{q(t)}{C} = -R\\frac{\\partial q(t)}{\\partial t}";

//RC
export const RCI_ON_CHARGE      = "I(t) = \\frac{\\varepsilon}{R} \\mathcal{\\huge e}^{\\frac{-t}{RC}}";
export const VR_ON_CHARGE       = "V_R(t) = R \\cdot \\mathcal{\\huge e}^{\\frac{-t}{RC}}";
export const VC_ON_CHARGE       = "V_C(t) = \\varepsilon \\cdot \\left( 1 - \\mathcal{\\huge e}^{\\frac{-t}{RC}} \\right)";

export const RCI_ON_DISCHARGE   = "I(t) = \\frac{-q_0}{RC} \\cdot \\mathcal{\\huge e}^{\\frac{-t}{RC}}";
export const VR_ON_DISCHARGE    = "V_R(t) = \\frac{-q_0}{C} \\cdot \\mathcal{\\huge e}^{\\frac{-t}{RC}}";
export const VC_ON_DISCHARGE    = "V_C(t) = \\frac{q_0}{C} \\cdot \\mathcal{\\huge e}^{\\frac{-t}{RC}}";

export const RC_ENERGY          = "E(t) = \\frac{1}{2}CV_C(t)^2";

//RL
export const VL_DEFINITION      = "V_L(t) = L \\cdot \\frac{\\partial I(t)}{\\partial t}";
export const DIFF_EQ_IND_CHARGE = "\\varepsilon = L \\cdot \\frac{\\partial I(t)}{\\partial t} + R\\cdot I(t)";

//FUNCTS
export function WRITE_FORMULA(f, i){
    return (<MathJax.Provider>
                <MathJax.Node inline={i} formula={f} />
            </MathJax.Provider>)
}