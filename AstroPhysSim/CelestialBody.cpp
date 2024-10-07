#include "CelestialBody.h"

CelestialBody::CelestialBody(std::string name, double mass, double radius,
                             std::array<double, 3> position, std::array<double, 3> velocity)
    : name(name), mass(mass), radius(radius), position(position), velocity(velocity) {}
