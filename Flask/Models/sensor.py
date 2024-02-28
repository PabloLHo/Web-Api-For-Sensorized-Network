class Sensor:
    def __init__(self, datos, fecha):
        self.datos = datos
        self.fecha = fecha
    def to_dict(self):
        return {
            "datos": self.datos,
            "fecha": self.fecha,
        }

    @staticmethod
    def from_dict(sensor_dict):
        return Sensor(
            datos=sensor_dict["datos"],
            fecha=sensor_dict["fecha"],
        )

    def getDatos(self):
        return self.datos

    def getFecha(self):
        return self.fecha

