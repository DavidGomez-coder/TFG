import matplotlib.pyplot as plt
import numpy as np
import math
from .RCFormulas import RCFormulas


class RCSimulation:
    def __init__(self, CAPACITOR, RESISTOR, VOLTAGE, TIME, INC) -> None:
        self.figure, self.axis = plt.subplots(3, 2, figsize=(7, 9))
        self.x = np.arange(0, TIME, INC)
        self.formula = RCFormulas(CAPACITOR, RESISTOR, VOLTAGE)
        self.figure.suptitle(f"Carga y descarga de un inductor \n para R={RESISTOR}Ω, ε={VOLTAGE}V y C={CAPACITOR}F \n (escala de tiempo: {INC}s)", fontsize=10, fontweight="bold")

    def show(self):
        q_on_charge_v    = np.vectorize(self.formula.Q_ON_CHARGE)
        q_on_discharge_v = np.vectorize(self.formula.Q_ON_DISCHARGE)
        self.axis[0, 0].plot(self.x, q_on_charge_v(self.x))
        self.axis[0, 0].plot(self.x, q_on_discharge_v(self.x))
        self.axis[0, 0].set_title("Carga del condensador",fontsize=9, fontweight="bold")
        self.axis[0, 0].set_xlabel("Tiempo (s)", fontsize=9)
        self.axis[0, 0].set_ylabel("Q (Culombios)", fontsize=9)
        self.axis[0, 0].margins(x=0, y=0)


        i_on_charge_v    = np.vectorize(self.formula.I_ON_CHARGE)
        i_on_discharge_v = np.vectorize(self.formula.I_ON_DISCHARGE)
        self.axis[0, 1].plot(self.x, i_on_charge_v(self.x))
        self.axis[0, 1].plot(self.x, i_on_discharge_v(self.x))
        self.axis[0, 1].set_title("Intensidad de corriente",fontsize=9, fontweight="bold")
        self.axis[0, 1].set_xlabel("Tiempo (s)", fontsize=9)
        self.axis[0, 1].set_ylabel("I (Amperios)", fontsize=9)
        self.axis[0, 1].margins(x=0, y=0)

        vc_on_charge_v    = np.vectorize(self.formula.VC_ON_CHARGE)
        vc_on_discharge_v = np.vectorize(self.formula.VC_ON_DISCHARGE)
        self.axis[1, 0].plot(self.x, vc_on_charge_v(self.x))
        self.axis[1, 0].plot(self.x, vc_on_discharge_v(self.x))
        self.axis[1, 0].set_title("DDP en el condensador",fontsize=9, fontweight="bold")
        self.axis[1, 0].set_xlabel("Tiempo (s)", fontsize=9)
        self.axis[1, 0].set_ylabel("V (Voltios)", fontsize=9)
        self.axis[1, 0].margins(x=0, y=0)

        vr_on_charge_v    = np.vectorize(self.formula.VR_ON_CHARGE)
        vr_on_discharge_v = np.vectorize(self.formula.VR_ON_DISCHARGE)
        self.axis[1, 1].plot(self.x, vr_on_charge_v(self.x))
        self.axis[1, 1].plot(self.x, vr_on_discharge_v(self.x))
        self.axis[1, 1].set_title("DDP en la resistencia",fontsize=9, fontweight="bold")
        self.axis[1, 1].set_xlabel("Tiempo (s)", fontsize=9)
        self.axis[1, 1].set_ylabel("V (Voltios)", fontsize=9)
        self.axis[1, 1].margins(x=0, y=0)

        e_on_charge_v    = np.vectorize(self.formula.E_ON_CHARGE)
        e_on_discharge_v = np.vectorize(self.formula.E_ON_DISCHARGE)
        self.axis[2, 0].plot(self.x, e_on_charge_v(self.x))
        self.axis[2, 0].plot(self.x, e_on_discharge_v(self.x))
        self.axis[2, 0].set_title("Energía almacenada",fontsize=9, fontweight="bold")
        self.axis[2, 0].set_xlabel("Tiempo (s)", fontsize=9)
        self.axis[2, 0].set_ylabel("E (Julios)", fontsize=9)
        self.axis[2, 0].margins(x=0, y=0)


        self.figure.delaxes(self.axis[2,1])

        plt.gcf().text(0.53, 0.25, "· Estado de almacenamiento de energía", fontsize=10, fontweight="bold", color="#1f77b4")
        plt.gcf().text(0.53, 0.2, "· Estado de disipación de energía", fontsize=10, fontweight="bold", color="#ff7f0e")
        self.figure.tight_layout()
        

        plt.savefig('circuito-RC.png', dpi=600)
        plt.show()