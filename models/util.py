import random

import torch
import torch.nn as nn


def r(minimum, maximum):
    return minimum + (maximum - minimum) * random.random()


def optimiz(a, v, m):
    if m == 0:
        if v > -0.2:
            v = r(-0.8, -0.2)
    if m == 1:
        if v > -0.2:
            v = r(-0.8, -0.3)
    if m == 2:
        if v > 0:
            v = r(-0.4, -0.2)
    if m == 3:
        if v < 0:
            v = r(0.2, 0.6)
    if m == 4:
        if v > 0.2 or v < -0.2:
            v = r(-0.1, 0.1)
    if m == 5:
        if v > 0:
            v = r(-0.6, -0.2)
    if m == 6:
        if v > 0.3 or v < -0.3:
            v = r(-0.3, 0.3)
    return [v, a]


class Util(nn.Module):
    def __init__(self):
        super(Util, self).__init__()
