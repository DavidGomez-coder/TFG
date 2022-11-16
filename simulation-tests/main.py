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

args = parser.parse_args()

if args.simulationType is None:
    print("[ERROR] : Se debe proporcionar el tipo de simulación: --st RC o --st RL")
    exit(-1)

INC       = float(args.incrementValue) if args.incrementValue is not None else 0.001
CAPACITOR = float(args.capacitor) if args.capacitor is not None else  5* math.pow(10, -3)
VOLTAGE   = float(args.voltage)  if args.voltage is not None else 5
RESISTOR  = float(args.resistor) if args.resistor is not None else  3
INDUCTOR  = float(args.inductor) if args.inductor is not None else 10


# ==================================================================================== #
#                               MAIN                                                   #
# ==================================================================================== #
if args.simulationType == 'RC':
    print("Generando resultados simulación RC ....")
    TIME = float(args.time) if args.time is not None else (5*RESISTOR*CAPACITOR)
    rcsim = RCSimulation(CAPACITOR, RESISTOR, VOLTAGE, TIME, INC)
    rcsim.show()
elif args.simulationType == 'RL':
    TIME = float(args.time) if args.time is not None else (5*(INDUCTOR/RESISTOR))
    print("Generando resultados simulación RL ....")
    rlsim = RLSimulation(INDUCTOR, RESISTOR, VOLTAGE, TIME, INC)
    rlsim.show()

else:
    print("[ERROR] : Se debe proporcionar el tipo de simulación: --st RC o --st RL")
