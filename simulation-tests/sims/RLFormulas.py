import math

class RLFormulas:
    def __init__(self, INDUCTOR, RESISTOR, VOLTAGE) -> None:
        self.INDUCTOR = INDUCTOR
        self.RESISTOR = RESISTOR
        self.VOLTAGE  = VOLTAGE
        self.I_MAX    = VOLTAGE / RESISTOR

    def I_ON_CHARGE(self, x):
        return float((self.VOLTAGE / self.RESISTOR) * (1- math.pow(math.e, (-self.RESISTOR * x)/(self.INDUCTOR))))

    def I_ON_DISCHARGE(self, x):
        return float(self.I_MAX * (math.pow(math.e, (-self.RESISTOR * x)/(self.INDUCTOR))))

    def VR_ON_CHARGE(self, x):
        return float(self.I_ON_CHARGE(x) * self.RESISTOR)

    def VR_ON_DISCHARGE(self, x):
        return float(self.I_ON_DISCHARGE(x) * self.RESISTOR)

    def VL_ON_CHARGE(self, x):
        return float(self.VOLTAGE  * math.pow(math.e, (-self.RESISTOR * x)/(self.INDUCTOR)))

    def VL_ON_DISCHARGE(self, x):
        return float(-self.VOLTAGE  * math.pow(math.e, (-self.RESISTOR * x)/(self.INDUCTOR)))

    def E_ON_CHARGE(self, x):
        return float(1/2)*self.INDUCTOR*math.pow(self.I_ON_CHARGE(x), 2)

    def E_ON_DISCHARGE(self, x):
        return float(1/2)*self.INDUCTOR*math.pow(self.I_ON_DISCHARGE(x), 2)

    def PHI_ON_CHARGE(self, x):
        return self.INDUCTOR * self.I_ON_CHARGE(x)

    def PHI_ON_DISCHARGE(self, x):
        return self.INDUCTOR * self.I_ON_DISCHARGE(x)