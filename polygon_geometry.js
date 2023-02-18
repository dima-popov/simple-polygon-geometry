class Polygon {
  constructor(points, x = 0, y = 0) {
    this.points = points;
    this.x = x;
    this.y = y;
  }

  getPointsCoords(x = 0, y = 0) {
    const points_arr = [];
    this.points.forEach(function (elm) {
      points_arr.push(elm.x + x);
      points_arr.push(elm.y + y);
    });
    return points_arr;
  }

  getAreaByShoelaceFormula(arg, scale = 1) {
    const arr = [...arg, arg[0]];
    var x_sum = 0;
    var y_sum = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      x_sum += (arr[i].x / scale) * (arr[i + 1].y / scale);
      y_sum += (arr[i].y / scale) * (arr[i + 1].x / scale);
    }

    return Number((Math.abs(x_sum - y_sum) / 2).toFixed(2));
  }

  unbindPoints() {
    this.points.forEach(function (elm1) {
      elm1.x_bind = [];
      elm1.y_bind = [];
    });
  }

  bindPoints() {
    this.points.forEach(function (elm1) {
      elm1.x_bind = [];
      elm1.y_bind = [];

      this.points.forEach(function (elm2) {
        if (
          (elm1 !== elm2 &&
            elm1.x === elm2.x &&
            this.inStrLineX(elm1, elm2, this.points)) ||
          this.inStrLineX(elm2, elm1, this.points)
        ) {
          elm1.bindX(elm2);
          elm2.bindX(elm1);
        }

        if (
          (elm1 !== elm2 &&
            elm1.y === elm2.y &&
            this.inStrLineY(elm1, elm2, this.points)) ||
          this.inStrLineY(elm2, elm1, this.points)
        ) {
          elm1.bindY(elm2);
          elm2.bindY(elm1);
        }
      }, this);
    }, this);

    const point_arr = [...this.points];
    const shift_arr = [];

    this.points.forEach(function (elm1) {
      shift_arr.push(point_arr.shift());

      const backward = [...point_arr, ...shift_arr];

      this.points.forEach(function (elm2) {
        if (
          (elm1 !== elm2 &&
            elm1.x === elm2.x &&
            this.inStrLineX(elm1, elm2, backward)) ||
          this.inStrLineX(elm2, elm1, backward)
        ) {
          elm1.bindX(elm2);
          elm2.bindX(elm1);
        }

        if (
          (elm1 !== elm2 &&
            elm1.y === elm2.y &&
            this.inStrLineY(elm1, elm2, backward)) ||
          this.inStrLineY(elm2, elm1, backward)
        ) {
          elm1.bindY(elm2);
          elm2.bindY(elm1);
        }
      }, this);
    }, this);
  }

  getPath(elm1, elm2, arr) {
    const path = [];
    const start = arr.indexOf(elm1);
    const i = start;
    const end = arr.indexOf(elm2);
    while (i < end) {
      path.push(arr[i]);
      i++;
    }
    if (end > start) {
      path.push(elm2);
    }
    return path;
  }

  inStrLineX(elm1, elm2, arr) {
    const path = this.getPath(elm1, elm2, arr);
    var result = true;

    for (let i = 0; i < path.length; i++) {
      if (elm1.x != path[i].x) {
        result = false;
        break;
      }
    }

    if (path.length === 0) {
      result = false;
    }

    return result;
  }

  inStrLineY(elm1, elm2, arr) {
    const path = this.getPath(elm1, elm2, arr);
    const result = true;

    for (let i = 0; i < path.length; i++) {
      if (elm1.y != path[i].y) {
        result = false;
        break;
      }
    }

    if (path.length === 0) {
      result = false;
    }

    return result;
  }

  pointDistanceLimitation(point, exept) {
    const distance = 10;
    const closed_points = [...this.points];
    const close_point = [];

    for (let i = 0; i < closed_points.length; i++) {
      if (point !== closed_points[i] && exept !== closed_points[i]) {
        if (
          Math.abs(point.x - closed_points[i].x) < distance &&
          Math.abs(point.y - closed_points[i].y) < distance
        ) {
          close_point.push(closed_points[i]);
        }
      }
    }

    return close_point;
  }

  neighborPoints(elm) {
    const index = this.points.indexOf(elm);
    const elm2 =
      this.points[(index + (this.points.length - 1)) % this.points.length];
    const elm3 =
      this.points[(index + (this.points.length + 1)) % this.points.length];

    return [elm2, elm, elm3];
  }

  getSides() {
    const closed_points = [...this.points, this.points[0]];
    const side_arr = [];

    for (let i = 0; i < closed_points.length - 1; i++) {
      side_arr.push([
        closed_points[i].x,
        closed_points[i].y,
        closed_points[i + 1].x,
        closed_points[i + 1].y,
      ]);
    }

    return side_arr;
  }

  hasIntersection(intersects) {
    const intersections = [];

    const sides = this.getSides();

    sides.forEach((elm1) => {
      sides.forEach((elm2) => {
        const lines = [
          elm1[0],
          elm1[1],
          elm1[2],
          elm1[3],
          elm2[0],
          elm2[1],
          elm2[2],
          elm2[3],
        ];
        if (intersects(...lines)) {
          if (!intersections.includes(elm1)) {
            intersections.push(elm1);
          }
        }
      });
    });

    return intersections;
  }

  intersects(a, b, c, d, p, q, r, s) {
    const det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;

      return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
    }
  }

  intersectionPoint(x1, y1, x2, y2, x3, y3, x4, y4) {
    const px =
      ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
      ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    const py =
      ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
      ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    return [px, py];
  }

  haveIntersection(r1, r2) {
    return !(
      r2.x > r1.x + r1.width ||
      r2.x + r2.width < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + r2.height < r1.y
    );
  }

  hasCoincident(coincident) {
    const coincidentArr = [];

    const sides = this.getSides();

    sides.forEach((elm1) => {
      sides.forEach((elm2) => {
        var lines = [
          elm1[0],
          elm1[1],
          elm1[2],
          elm1[3],
          elm2[0],
          elm2[1],
          elm2[2],
          elm2[3],
        ];
        if (
          elm1[0] -
            elm2[0] +
            elm1[1] -
            elm2[1] +
            elm1[2] -
            elm2[2] +
            elm1[3] -
            elm2[3] !=
          0
        ) {
          var add = true;
          if (coincident(...lines)) {
            coincidentArr.forEach((elm_loc) => {
              if (elm_loc[0] === elm2 && elm_loc[1] === elm1) {
                add = false;
              }
            });
            if (add) {
              coincidentArr.push([elm1, elm2]);
            }
          }
        }
      });
    });

    return coincidentArr;
  }

  getSidesLength(arr, scale = 1) {
    const closed_points = [...arr];
    const length_arr = [];

    for (let i = 0; i < closed_points.length - 1; i++) {
      length_arr.push(
        Math.round(
          Math.sqrt(
            Math.abs(
              closed_points[i].x / scale - closed_points[i + 1].x / scale
            ) **
              2 +
              Math.abs(
                closed_points[i].y / scale - closed_points[i + 1].y / scale
              ) **
                2
          )
        )
      );
    }

    return length_arr;
  }

  getSidesCenters(arr) {
    const closed_points = [...arr];
    const center_arr = [];

    for (let i = 0; i < closed_points.length - 1; i++) {
      center_arr.push({
        x:
          closed_points[i].x -
          (closed_points[i].x - closed_points[i + 1].x) / 2,
        y:
          closed_points[i].y -
          (closed_points[i].y - closed_points[i + 1].y) / 2,
        length: Math.round(
          Math.sqrt(
            Math.abs(closed_points[i].x - closed_points[i + 1].x) ** 2 +
              Math.abs(closed_points[i].y - closed_points[i + 1].y) ** 2
          )
        ),
      });
    }

    return center_arr;
  }

  coincident(a, b, c, d, p, q, r, s) {
    if (!this.intersects(a, b, c, d, p, q, r, s)) {
      const A = [a, b];
      const B = [c, d];
      const C = [p, q];
      const D = [r, s];

      const comb = [
        [A, B, C, D],
        [C, D, A, B],
        [A, B, D, C],
        [A, D, B, C],
        [D, A, C, B],
        [D, A, B, C],
        [A, D, C, B],
        [A, C, D, B],
        [D, B, A, C],
      ];

      comb.forEach((elm) => {
        if (this.inLine(...[...elm[0], ...elm[1], ...elm[2], ...elm[3]])) {
          const l1 = this.getSidesLength([
            { x: elm[0][0], y: elm[0][1] },
            { x: elm[3][0], y: elm[3][1] },
          ])[0];

          const l2 = this.getSidesLength([
            { x: elm[0][0], y: elm[0][1] },
            { x: elm[1][0], y: elm[1][1] },
          ])[0];

          const l3 = this.getSidesLength([
            { x: elm[2][0], y: elm[2][1] },
            { x: elm[3][0], y: elm[3][1] },
          ])[0];

          if (l1 < l2 + l3) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    }
  }

  inLine(a, b, c, d, p, q, r, s) {
    var ab_rs = this.getSidesLength([
      { x: a, y: b },
      { x: r, y: s },
    ])[0];
    var ab_cd = this.getSidesLength([
      { x: a, y: b },
      { x: c, y: d },
    ])[0];
    var ab_pq = this.getSidesLength([
      { x: a, y: b },
      { x: p, y: q },
    ])[0];
    var cd_rs = this.getSidesLength([
      { x: c, y: d },
      { x: r, y: s },
    ])[0];
    var pq_rs = this.getSidesLength([
      { x: p, y: q },
      { x: r, y: s },
    ])[0];
    if (
      (ab_rs === ab_cd + cd_rs && ab_rs === ab_pq + pq_rs) ||
      (ab_rs === ab_cd + cd_rs + 1 && ab_rs === ab_pq + pq_rs + 1) ||
      (ab_rs === ab_cd + cd_rs - 1 && ab_rs === ab_pq + pq_rs - 1)
    ) {
      return true;
    } else {
      return false;
    }
  }

  getSlope(x1, y1, x2, y2) {
    //Slope= rise/run = Δy/Δx;

    return (y2 - y1) / (x2 - x1);
  }

  areParallel(x1, y1, x2, y2, x3, y3, x4, y4) {
    //Slope= rise/run = Δy/Δx;

    return (y2 - y1) / (x2 - x1) === (y4 - y3) / (x4 - x3);
  }

  is_inside(point, w = window.screen.width) {
    let line = [...point, point[0] + w, point[1]];

    let intersections = 0;

    this.getSides().forEach((side) => {
      if (
        this.intersects(
          ...line,
          side[0] + this.x,
          side[1] + this.y,
          side[2] + this.x,
          side[3] + this.y
        ) === true
      ) {
        intersections++;
      }
    });

    return intersections % 2 !== 0;
  }
}

class Point {
  constructor(x, y) {
    this.px = x;
    this.py = y;
    this.x = x;
    this.y = y;
    this.x_bind = [];
    this.y_bind = [];
  }

  bindX(point) {
    if (!this.x_bind.includes(point)) {
      this.x_bind.push(point);
    }
  }

  bindY(point) {
    if (!this.y_bind.includes(point)) {
      this.y_bind.push(point);
    }
  }

  set x(val) {
    this.diffX = this.px - val;
    this.px = val;
  }
  set y(val) {
    this.diffY = this.py - val;
    this.py = val;
  }
  get x() {
    return this.px;
  }
  get y() {
    return this.py;
  }

  recalculateBinX() {
    this.x_bind.forEach((bound) => {
      bound.x -= this.diffX;
    });
  }
  recalculateBinY() {
    this.y_bind.forEach((bound) => {
      bound.y -= this.diffY;
    });
  }
}

//export { Point, Polygon };

//  const point1 = new Point(0, 0);
//  const polygon = new Polygon([point1, point2, point3, point4]);
