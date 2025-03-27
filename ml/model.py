import numpy as np
import pandas as pd
import joblib
import os, glob
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from keras.models import Sequential, load_model
from keras.layers import Dense, LSTM
from keras.optimizers import Adam
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

class HealthForecastModel:
    def __init__(self):
        self.rnn_model = None
        self.gboost_model = GradientBoostingRegressor(n_estimators=200, learning_rate=0.05, max_depth=4)
        self.ensemble_weights = [0.6, 0.4]

    def prepare_data(self, data: pd.DataFrame):
        X = data[['steps', 'heart_rate', 'sleep_hours']].values
        y = data['target_metric'].values
        return train_test_split(X, y, test_size=0.2, random_state=42)

    def build_rnn_model(self, input_dim: int):
        model = Sequential()
        model.add(LSTM(32, input_shape=(None, input_dim), activation='tanh'))
        model.add(Dense(1))
        model.compile(loss='mse', optimizer=Adam(learning_rate=0.001))
        return model

    def train_models(self, data: pd.DataFrame):
        X_train, X_test, y_train, y_test = self.prepare_data(data)
        self.gboost_model.fit(X_train, y_train)
        X_train_rnn, X_test_rnn = np.expand_dims(X_train, axis=1), np.expand_dims(X_test, axis=1)
        self.rnn_model = self.build_rnn_model(X_train.shape[1])
        self.rnn_model.fit(X_train_rnn, y_train, validation_data=(X_test_rnn, y_test), epochs=30, batch_size=16, verbose=0)
        joblib.dump(self.gboost_model, 'gboost_model.pkl')
        self.rnn_model.save('rnn_model.h5')

    def load_models(self):
        if os.path.exists('gboost_model.pkl') and os.path.exists('rnn_model.h5'):
            self.gboost_model = joblib.load('gboost_model.pkl')
            self.rnn_model = load_model('rnn_model.h5')
        else:
            raise FileNotFoundError("Saved models not found. Train models first.")

    def predict(self, new_data: np.ndarray):
        if self.rnn_model is None:
            raise RuntimeError("Models have not been trained or loaded.")
        new_data_rnn = np.expand_dims(new_data, axis=1)
        rnn_preds = self.rnn_model.predict(new_data_rnn).flatten()
        gboost_preds = self.gboost_model.predict(new_data)
        return self.ensemble_weights[0] * rnn_preds + self.ensemble_weights[1] * gboost_preds

    def optimize_over_time(self, new_data: pd.DataFrame):
        self.train_models(new_data)

def load_and_prepare_data():
    daily_path = "d:\\healthcare3\\ml\\Fitabase_Data\\dailyActivity_merged.csv"
    hr_path = "d:\\healthcare3\\ml\\Fitabase_Data\\heartrate_seconds_merged.csv"
    sleep_path = "d:\\healthcare3\\ml\\Fitabase_Data\\minuteSleep_merged.csv"
    steps_path = "d:\\healthcare3\\ml\\Fitabase_Data\\minuteStepsNarrow_merged.csv"
    
    daily_df = pd.read_csv(daily_path).rename(columns={"ActivityDate": "date", "TotalSteps": "steps", "Calories": "target_metric"})
    hr_df = pd.read_csv(hr_path)
    sleep_df = pd.read_csv(sleep_path)
    steps_df = pd.read_csv(steps_path)
    
    daily_df["date"] = pd.to_datetime(daily_df["date"])
    hr_df["Time"] = pd.to_datetime(hr_df["Time"])
    hr_df["date"] = hr_df["Time"].dt.floor('D')
    hr_agg = hr_df.groupby(["Id", "date"], as_index=False)["Value"].mean().rename(columns={"Value": "heart_rate"})
    
    sleep_df["date"] = pd.to_datetime(sleep_df["date"]).dt.floor('D')
    sleep_agg = sleep_df.groupby(["Id", "date"], as_index=False)["value"].sum()
    sleep_agg["sleep_hours"] = sleep_agg["value"] / 60.0
    
    merged_df = pd.merge(daily_df, hr_agg, on=["Id", "date"], how="inner")
    merged_df = pd.merge(merged_df, sleep_agg[["Id", "date", "sleep_hours"]], on=["Id", "date"], how="inner")
    merged_df.dropna(subset=["steps", "heart_rate", "sleep_hours", "target_metric"], inplace=True)
    
    return merged_df

if __name__ == "__main__":
    combined_df = load_and_prepare_data()
    X = combined_df[['steps', 'heart_rate', 'sleep_hours']].values
    y = combined_df['target_metric'].values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    df_train = pd.DataFrame(X_train, columns=['steps', 'heart_rate', 'sleep_hours'])
    df_train['target_metric'] = y_train
    
    model = HealthForecastModel()
    model.train_models(df_train)
    predictions = model.predict(X_test)
    mse, mae, r2 = mean_squared_error(y_test, predictions), mean_absolute_error(y_test, predictions), r2_score(y_test, predictions)
    
    print("Evaluation Metrics:")
    print(f"MSE: {mse:.2f}")
    print(f"MAE: {mae:.2f}")
    print(f"R2 Score: {r2:.2f}")
