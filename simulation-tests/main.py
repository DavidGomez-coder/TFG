from sims.RCSimulation import RCSimulation
from sims.RLSimulation import RLSimulation
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import math
import argparse


# ==================================================================================== #
#                               PARSER                                                 #
# ==================================================================================== #
parser = argparse.ArgumentParser(prog='Simulation Tests')
parser.add_argument('-t',   '--time')
parser.add_argument('-st',  '--simulationType')
parser.add_argument('-inc', '--incrementValue')
parser.add_argument('-c',   '--capacitor')
parser.add_argument('-r',   '--resistor')
parser.add_argument('-v',   '--voltage')
parser.add_argument('-i',   '--inductor')
parser.add_argument('-condV','--conditionVal')    # condición de parada. Carga del condensador para RC (Culombios), intensidad de corriente para RL (Amperios)
parser.add_argument('-condP', '--conditionPer')  # condición de parada. Porcentaje de carga del condensador para RC, intensidad de corriente para RL

args = parser.parse_args()

if args.simulationType is None:
    print("[ERROR] : Se debe proporcionar el tipo de simulación: --st RC o --st RL")
    exit(-1)

INC       = float(args.incrementValue) if args.incrementValue is not None else 0.001
CAPACITOR = float(args.capacitor) if args.capacitor is not None else  5* math.pow(10, -3)
VOLTAGE   = float(args.voltage)  if args.voltage is not None else 5
RESISTOR  = float(args.resistor) if args.resistor is not None else  3
INDUCTOR  = float(args.inductor) if args.inductor is not None else 10

CONDITION_VALUE = float(args.conditionVal) if args.conditionVal is not None else None
CONDITION_PERCE = float(args.conditionPer) if args.conditionPer is not None else None

# condition builder
CONDITION = -1

if (CONDITION_VALUE is not None and CONDITION_PERCE is not None):
    print("[ERROR] : Solo se debe de dar una condición de parada -condV o -condP")
    exit(-1)
if CONDITION_VALUE is not None:
    CONDITION = CONDITION_VALUE


# ==================================================================================== #
#                               MAIN                                                   #
# ==================================================================================== #
if args.simulationType == 'RC':
    print("Generando resultados simulación RC ....")
    # simulation time
    TIME = float(args.time) if args.time is not None else (5*RESISTOR*CAPACITOR)
    # condition percent
    if CONDITION_PERCE is not None:
        CONDITION = (CAPACITOR * VOLTAGE) * (CONDITION_PERCE/100)
    rcsim = RCSimulation(CAPACITOR, RESISTOR, VOLTAGE, TIME, INC, CONDITION)
    rcsim.show()
elif args.simulationType == 'RL':
    TIME = float(args.time) if args.time is not None else (5*(INDUCTOR/RESISTOR))
    if CONDITION_PERCE is not None:
        CONDITION = (VOLTAGE / RESISTOR) * (CONDITION_PERCE/100)
    print("Generando resultados simulación RL ....")
    rlsim = RLSimulation(INDUCTOR, RESISTOR, VOLTAGE, TIME, INC, CONDITION)
    rlsim.show()

else:
    print("[ERROR] : Se debe proporcionar el tipo de simulación: --st RC o --st RL")
