import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from keras.models import Sequential
from keras.layers import Dense, LSTM
from keras.optimizers import Adam
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, f1_score, accuracy_score
import glob, os
from keras.callbacks import Callback
import matplotlib.pyplot as plt

class EpochLogger(Callback):
    def on_epoch_end(self, epoch, logs=None):
        if logs is not None:
            print(f"Epoch {epoch + 1} ended.")#Loss: {logs.get('loss', 0):.4f}")

class HealthForecastModel:
    def __init__(self):
        # Individual models
        self.rnn_model = None
        self.gboost_model = GradientBoostingRegressor(n_estimators=100)
        # Combine outputs using ensemble weights: [RNN weight, Gradient Boosting weight]
        self.ensemble_weights = [0.6, 0.4]

    def prepare_data(self, data: pd.DataFrame):
        """
        Split data into numeric training sets for RNN and Gradient Boosting.
        Expects columns: ['steps', 'heart_rate', 'sleep_hours', 'target_metric'].
        """
        X = data[['steps', 'heart_rate', 'sleep_hours']].values
        y = data['target_metric'].values
        return train_test_split(X, y, test_size=0.2, random_state=42)

    def build_rnn_model(self, input_dim: int):
        # Build a simple LSTM-based RNN for time-series forecasting
        model = Sequential()
        model.add(LSTM(16, input_shape=(None, input_dim), activation='tanh'))
        model.add(Dense(1))
        model.compile(loss='mse', optimizer=Adam(learning_rate=0.001))
        return model

    def train_models(self, data: pd.DataFrame):
        # Prepare training and testing data
        X_train, X_test, y_train, y_test = self.prepare_data(data)
        # Train Gradient Boosting model
        self.gboost_model.fit(X_train, y_train)
        # Reshape data for RNN (each row treated as one time step)
        X_train_rnn = np.expand_dims(X_train, axis=1)
        X_test_rnn = np.expand_dims(X_test, axis=1)
        # Build and train RNN model
        self.rnn_model = self.build_rnn_model(X_train.shape[1])
        self.rnn_model.fit(
            X_train_rnn,
            y_train,
            validation_data=(X_test_rnn, y_test),
            epochs=20,
            batch_size=16,
            verbose=0,
            callbacks=[EpochLogger()]
        )

    def predict(self, new_data: np.ndarray):
        """
        Generate forecasts for new_data (shape: [n_samples, 3]).
        Combine predictions from RNN and Gradient Boosting using ensemble weights.
        """
        if self.rnn_model is None:
            raise RuntimeError("Models have not been trained yet.")
        new_data_rnn = np.expand_dims(new_data, axis=1)
        rnn_preds = self.rnn_model.predict(new_data_rnn).flatten()
        gboost_preds = self.gboost_model.predict(new_data)
        ensemble_preds = (self.ensemble_weights[0] * rnn_preds + self.ensemble_weights[1] * gboost_preds)
        return ensemble_preds

    def optimize_over_time(self, new_data: pd.DataFrame):
        """
        Retrain models periodically as new data becomes available.
        """
        self.train_models(new_data)

def load_and_prepare_data():
    # Load daily activity and rename needed columns
    daily_path = os.path.join("d:\\healthcare3\\ml\\Fitabase_Data", "dailyActivity_merged.csv")
    daily_df = pd.read_csv(daily_path)
    daily_df = daily_df.rename(columns={"ActivityDate": "date", "TotalSteps": "steps"})
    # Convert date to consistent format
    daily_df["date"] = pd.to_datetime(daily_df["date"])
    # Let's pick 'Calories' as our target metric
    daily_df = daily_df.rename(columns={"Calories": "target_metric"})
    
    # Load heartrate data, group by date
    hr_path = os.path.join("d:\\healthcare3\\ml\\Fitabase_Data", "heartrate_seconds_merged.csv")
    hr_df = pd.read_csv(hr_path)
    hr_df["Time"] = pd.to_datetime(hr_df["Time"])
    hr_df["date"] = hr_df["Time"].dt.floor('D')
    hr_agg = hr_df.groupby(["Id", "date"], as_index=False)["Value"].mean()
    hr_agg = hr_agg.rename(columns={"Value": "heart_rate"})
    
    # Load daily sleep data from minuteSleep_merged, sum minutes by day
    sleep_path = os.path.join("d:\\healthcare3\\ml\\Fitabase_Data", "minuteSleep_merged.csv")
    sleep_df = pd.read_csv(sleep_path)
    sleep_df["date"] = pd.to_datetime(sleep_df["date"]).dt.floor('D')
    sleep_agg = sleep_df.groupby(["Id", "date"], as_index=False)["value"].sum()
    # Convert minutes to hours
    sleep_agg["sleep_hours"] = sleep_agg["value"] / 60.0
    
    # Merge them all
    merged_df = pd.merge(daily_df, hr_agg, on=["Id", "date"], how="inner")
    merged_df = pd.merge(merged_df, sleep_agg[["Id", "date", "sleep_hours"]], on=["Id", "date"], how="inner")
    
    # Drop rows missing any of our core columns
    required_columns = ["steps", "heart_rate", "sleep_hours", "target_metric"]
    merged_df.dropna(subset=required_columns, inplace=True)

    if merged_df.empty:
        raise ValueError("No data found after merging and dropping NaN rows.")
    
    return merged_df

if __name__ == "__main__":
    # Load data from Fitabase_Data
    combined_df = load_and_prepare_data()
    # Split data into training and testing sets
    X = combined_df[['steps', 'heart_rate', 'sleep_hours']].values
    y = combined_df['target_metric'].values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    # Create DataFrame for training as expected by train_models()
    df_train = pd.DataFrame(X_train, columns=['steps', 'heart_rate', 'sleep_hours'])
    df_train['target_metric'] = y_train
    # Train the model
    model = HealthForecastModel()
    model.train_models(df_train)
    # Predict on the test set
    predictions = model.predict(X_test)
    # Compute regression metrics
    mse = mean_squared_error(y_test, predictions)
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    # For classification metrics, threshold predictions
    threshold = 50
    y_test_class = (y_test >= threshold).astype(int)
    pred_class = (predictions >= threshold).astype(int)
    f1 = f1_score(y_test_class, pred_class)
    accuracy = accuracy_score(y_test_class, pred_class)
    # Print evaluation metrics
    print("Evaluation Metrics:")
    # print(f"MSE: {mse:.2f}")
    # print(f"MAE: {mae:.2f}")
    # print(f"R2 Score: {r2:.2f}")
    print(f"Accuracy (threshold {threshold}): {accuracy:.2f}")
    print(f"F1 Score (threshold {threshold}): {f1:.2f}")
    
    # plt.figure(figsize=(8, 5))
    # plt.plot(y_test, label='Actual', marker='o')
    # plt.plot(predictions, label='Predicted', marker='x')
    # plt.title('Forecast Visualization')
    # plt.legend()
    # plt.xlabel('Sample')
    # plt.ylabel('Target Metric')
    # plt.show()