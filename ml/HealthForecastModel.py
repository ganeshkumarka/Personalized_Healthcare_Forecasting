import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from keras.models import Sequential
from keras.layers import Dense, LSTM
from keras.optimizers import Adam

class HealthForecastModel:
    def __init__(self):
        # Individual models
        self.rnn_model = None
        self.gboost_model = GradientBoostingRegressor(n_estimators=100)
        # Combine outputs from both models
        self.ensemble_weights = [0.6, 0.4]  # [RNN weight, Gradient Boosting weight]

    def prepare_data(self, data: pd.DataFrame):
        """
        Split data into numeric training sets for RNN and Gradient Boosting.
        Expects columns like ['steps', 'heart_rate', 'sleep_hours', 'target_metric', ...].
        """
        # ...existing code...
        X = data[['steps', 'heart_rate', 'sleep_hours']].values
        y = data['target_metric'].values
        return train_test_split(X, y, test_size=0.2, random_state=42)

    def build_rnn_model(self, input_dim: int):
        # Simple RNN (LSTM) for time-series forecasts
        model = Sequential()
        model.add(LSTM(16, input_shape=(None, input_dim), activation='tanh'))
        model.add(Dense(1))
        model.compile(loss='mse', optimizer=Adam(learning_rate=0.001))
        return model

    def train_models(self, data: pd.DataFrame):
        # Prepare data
        X_train, X_test, y_train, y_test = self.prepare_data(data)

        # Train Gradient Boosting Model
        self.gboost_model.fit(X_train, y_train)

        # Reshape for RNN: Assume each row is one time step (simplified)
        X_train_rnn = np.expand_dims(X_train, axis=1)
        X_test_rnn = np.expand_dims(X_test, axis=1)

        # Build & train the RNN model
        self.rnn_model = self.build_rnn_model(X_train.shape[1])
        self.rnn_model.fit(X_train_rnn, y_train, 
                           validation_data=(X_test_rnn, y_test),
                           epochs=10, batch_size=16, verbose=0)

    def predict(self, new_data: np.ndarray):
        """
        Generate forecasts for new_data, which is an array of shape [n_samples, 3].
        Combine RNN and Gradient Boosting predictions using ensemble weights.
        """
        if self.rnn_model is None:
            raise RuntimeError("Models have not been trained yet.")

        # RNN expects [samples, 1, features]
        new_data_rnn = np.expand_dims(new_data, axis=1)
        rnn_preds = self.rnn_model.predict(new_data_rnn).flatten()
        gboost_preds = self.gboost_model.predict(new_data)

        ensemble_preds = (self.ensemble_weights[0] * rnn_preds 
                          + self.ensemble_weights[1] * gboost_preds)
        return ensemble_preds

    def optimize_over_time(self, new_data: pd.DataFrame):
        """
        Periodically retrain or fine-tune models as more data arrives.
        This helps with continuous learning and personalization.
        """
        # ...existing code...
        self.train_models(new_data)

# Example usage:
if __name__ == "__main__":
    # Sample synthetic dataset
    df = pd.DataFrame({
        'steps': np.random.randint(3000, 12000, 200),
        'heart_rate': np.random.randint(50, 100, 200),
        'sleep_hours': np.random.uniform(4, 9, 200),
        'target_metric': np.random.uniform(0, 100, 200)
    })

    model = HealthForecastModel()
    model.train_models(df)

    # Simulate new data to predict
    new_samples = np.array([[8000, 70, 7.5],
                            [6500, 75, 6.2]])
    predictions = model.predict(new_samples)
    print("Predictions:", predictions)