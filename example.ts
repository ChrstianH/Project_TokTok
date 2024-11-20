import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Ersetze diese Werte mit deinen eigenen Supabase-Anmeldeinformationen
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

// Initialisiere den Supabase-Client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface YourDataType {
  id: number;
  // ... weitere Eigenschaften deiner Daten
}

const App: React.FC = () => {
  const [data, setData] = useState<YourDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Führe die Supabase-Abfrage aus
        const { data, error } = await supabase
          .from("your_table_name") // Ersetze 'your_table_name' mit dem Namen deiner Tabelle
          .select("*");

        if (error) {
          console.error("Fehler beim Abrufen der Daten:", error);
        } else {
          setData(data as YourDataType[]);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Leerer Abhängigkeits-Array stellt sicher, dass der Effekt nur einmal beim Mounten ausgeführt wird

  return (
    <div>
      <h1>Meine Daten</h1>
      {loading ? (
        <p>Daten werden geladen...</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {/* Zeige die Daten an */}
              {item.id} - {/* ... weitere Eigenschaften */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
