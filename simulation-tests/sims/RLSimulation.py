import matplotlib.pyplot as plt
import numpy as np
import math
from .RLFormulas import RLFormulas

class RLSimulation:
    def __init__(self, INDUCTOR, RESISTOR, VOLTAGE, TIME, INC, CONDITION) -> None:

        self.formula = RLFormulas(INDUCTOR, RESISTOR, VOLTAGE)
        self.time_char = TIME
        self.time_dis  = TIME
        if CONDITION > -1:
            if CONDITION < 0 or CONDITION > (VOLTAGE / RESISTOR):
                print(f"[ERROR] : Para estos parámetros, la intensidad de corriente debe de estar entre 0 y {VOLTAGE / RESISTOR} amperios")
                exit(-1)
            else:
                self.time_char = self.formula.T_ON_CHARGE_Q(CONDITION)
                self.time_dis  = self.formula.T_ON_DISCHARGE_Q(CONDITION)

        self.figure, self.axis = plt.subplots(3, 2, figsize=(7, 9))
        self.x_charge = np.arange(0, self.time_char + INC, INC)
        self.x_discharge = np.arange(0, self.time_dis + INC, INC)

        self.figure.suptitle(f"Carga y descarga de un inductor \n para R={RESISTOR}Ω, ε={VOLTAGE}V y L={INDUCTOR}H \n (escala de tiempo: {INC}s)", fontsize=10, fontweight="bold")

    def show(self):
        i_on_charge_v    = np.vectorize(self.formula.I_ON_CHARGE)
        i_on_discharge_v = np.vectorize(self.formula.I_ON_DISCHARGE)
        self.axis[0, 0].plot(self.x_charge, i_on_charge_v(self.x_charge))
        self.axis[0, 0].plot(self.x_discharge, i_on_discharge_v(self.x_discharge))
        self.axis[0, 0].set_title("Intensidad de corriente",fontsize=9, fontweight="bold")
        self.axis[0, 0].set_xlabel("Tiempo (s)", fontsize=9)
        self.axis[0, 0].set_ylabel("I (Amperios)", fontsize=9)
        self.axis[0, 0].margins(x=0, y=0)
        self.axis[0, 0].axvline(self.time_char, color='gray', linestyle='dashed')
        self.axis[0, 0].axvline(self.time_dis, color='gray' , linestyle='dashed')
        #plt.axvline(x = 7, color = 'b', label = 'axvline - full height')

        vl_on_charge_v    = np.vectorize(self.formula.VL_ON_CHARGE)
        vl_on_discharge_v = np.vectorize(self.formula.VL_ON_DISCHARGE)
        self.axis[0, 1].plot(self.x_charge, vl_on_charge_v(self.x_charge))
        self.axis[0, 1].plot(self.x_discharge, vl_on_discharge_v(self.x_discharge))
        self.axis[0, 1].set_title("DDP en el inductor",fontsize=9, fontweight="bold")
        self.axis[0, 1].set_xlabel("Tiempo (s)", fontsize=9)
        self.axis[0, 1].set_ylabel("V (Voltios)", fontsize=9)
        self.axis[0, 1].margins(x=0, y=0)
        self.axis[0, 1].axvline(self.time_char, color='gray', linestyle='dashed')
        self.axis[0, 1].axvline(self.time_dis, color='gray' , linestyle='dashed')

        vr_on_charge_v    = np.vectorize(self.formula.VR_ON_CHARGE)
        vr_on_discharge_v = np.vectorize(self.formula.VR_ON_DISCHARGE)
        self.axis[1, 0].plot(self.x_charge, vr_on_charge_v(self.x_charge))
        self.axis[1, 0].plot(self.x_discharge, vr_on_discharge_v(self.x_discharge))
        self.axis[1, 0].set_title("DDP en la resistencia",fontsize=9, fontweight="bold")
        self.axis[1, 0].set_xlabel("Tiempo (s)", fontsize=9)
        self.axis[1, 0].set_ylabel("V (Voltios)", fontsize=9)
        self.axis[1, 0].margins(x=0, y=0)
        self.axis[1, 0].axvline(self.time_char, color='gray', linestyle='dashed')
        self.axis[1, 0].axvline(self.time_dis, color='gray' , linestyle='dashed')


        e_on_charge_v    = np.vectorize(self.formula.E_ON_CHARGE)
        e_on_discharge_v = np.vectorize(self.formula.E_ON_DISCHARGE)
        self.axis[1, 1].plot(self.x_charge, e_on_charge_v(self.x_charge))
        self.axis[1, 1].plot(self.x_discharge, e_on_discharge_v(self.x_discharge))
        self.axis[1, 1].set_title("Energía almacenada",fontsize=9, fontweight="bold")
        self.axis[1, 1].set_xlabel("Tiempo (s)", fontsize=9)
        self.axis[1, 1].set_ylabel("E (Julios)", fontsize=9)
        self.axis[1, 1].margins(x=0, y=0)
        self.axis[1, 1].axvline(self.time_char, color='gray', linestyle='dashed')
        self.axis[1, 1].axvline(self.time_dis, color='gray' , linestyle='dashed')

        phi_on_charge_v    = np.vectorize(self.formula.PHI_ON_CHARGE)
        phi_on_discharge_v = np.vectorize(self.formula.PHI_ON_DISCHARGE)
        self.axis[2, 0].plot(self.x_charge, phi_on_charge_v(self.x_charge))
        self.axis[2, 0].plot(self.x_discharge, phi_on_discharge_v(self.x_discharge))
        self.axis[2, 0].set_title("Energía almacenada",fontsize=9, fontweight="bold")
        self.axis[2, 0].set_xlabel("Tiempo (s)", fontsize=9)
        self.axis[2, 0].set_ylabel("Φ (Weber)", fontsize=9)
        self.axis[2, 0].margins(x=0, y=0)
        self.axis[2, 0].axvline(self.time_char, color='gray', linestyle='dashed')
        self.axis[2, 0].axvline(self.time_dis, color='gray' , linestyle='dashed')


        self.figure.delaxes(self.axis[2,1])
        
        plt.gcf().text(0.53, 0.25, "· Estado de almacenamiento de energía", fontsize=10, fontweight="bold", color="#1f77b4")
        plt.gcf().text(0.53, 0.2, "· Estado de disipación de energía", fontsize=10, fontweight="bold", color="#ff7f0e")
        self.figure.tight_layout()
        plt.savefig('../circuito-RL.png', dpi=600)
        plt.show()
