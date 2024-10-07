#ifndef CELESTIAL_BODY_H
#define CELESTIAL_BODY_H

#include <string>
#include <array>

class CelestialBody {
public:
    std::string name;
    double mass;
    double radius;
    std::array<double, 3> position;  // x, y, z coordinates
    std::array<double, 3> velocity;  // vx, vy, vz velocities

    CelestialBody(std::string name, double mass, double radius,
                  std::array<double, 3> position, std::array<double, 3> velocity);
};

#endif
