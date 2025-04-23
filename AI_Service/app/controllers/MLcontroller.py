import os,joblib,requests,json,math
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

def prediction_expense(data,day_target):
    cumulative = np.cumsum(np.array([expense["total_expense"] for expense in data]))
    hari = np.arange(1,len(cumulative)+1)

    model = LinearRegression()
    model.fit(hari.reshape(-1,1),cumulative)

    y_pred = model.predict([[len(hari)+day_target]])
    return math.ceil(y_pred[0])

if __name__ == "__main__":
    data = [{"data":1000},{"data":2000}]
    print(prediction_expense(data,4))
