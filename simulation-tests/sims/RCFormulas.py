
import math


class RCFormulas:
    def __init__(self, CAPACITOR, RESISTOR, VOLTAGE) -> None:
        self.CAPACITOR = CAPACITOR
        self.RESISTOR  = RESISTOR
        self.VOLTAGE   = VOLTAGE
        self.Q_MAX     = CAPACITOR * VOLTAGE

    def Q_ON_CHARGE(self, x):
        return float(self.CAPACITOR*self.VOLTAGE*(1-math.pow(math.e, (-x) / (self.RESISTOR * self.CAPACITOR))))

    def Q_ON_DISCHARGE(self, x):
        return float(self.Q_MAX * math.pow(math.e, (-x) / (self.RESISTOR * self.CAPACITOR)))

    
    def I_ON_CHARGE(self, x):
        return float(self.VOLTAGE / self.RESISTOR) * math.pow(math.e, (-x) / (self.RESISTOR * self.CAPACITOR))

    def I_ON_DISCHARGE(self, x):
        return float(-self.Q_MAX / (self.RESISTOR * self.CAPACITOR)) * math.pow(math.e, (-x) / (self.RESISTOR * self.CAPACITOR))


    def VC_ON_CHARGE(self, x):
        return float(self.CAPACITOR*self.VOLTAGE*(1-math.pow(math.e, (-x) / (self.RESISTOR * self.CAPACITOR)))) / self.CAPACITOR

    def VC_ON_DISCHARGE(self, x):
        return float(self.Q_MAX * math.pow(math.e, (-x) / (self.RESISTOR * self.CAPACITOR))) / self.CAPACITOR

    
    def VR_ON_CHARGE(self, x):
        return float(self.VOLTAGE / self.RESISTOR) * math.pow(math.e, (-x) / (self.RESISTOR * self.CAPACITOR)) *  self.RESISTOR

    def VR_ON_DISCHARGE(self, x):
         return float(-self.Q_MAX / (self.RESISTOR * self.CAPACITOR)) * math.pow(math.e, (-x) / (self.RESISTOR * self.CAPACITOR)) * self.RESISTOR


    def E_ON_CHARGE(self, x):
        return float((1/2)*self.CAPACITOR*math.pow(self.VC_ON_CHARGE(x), 2))

    def E_ON_DISCHARGE(self, x):
        return float((1/2)*self.CAPACITOR*math.pow(self.VC_ON_DISCHARGE(x), 2))

    def T_ON_CHARGE_Q(self, q):
        return float(self.RESISTOR * self.CAPACITOR * (-math.log(self.Q_MAX - q) + math.log(self.Q_MAX)))

    def T_ON_DISCHARGE_Q(self, q):
        return float(-self.RESISTOR * self.CAPACITOR * (math.log(q) - math.log(self.Q_MAX)))