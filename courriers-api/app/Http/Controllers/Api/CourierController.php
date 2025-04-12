public function store(Request $request)
{
    try {
        Log::info('Requête reçue:', $request->all());

        // Supprimer la validation temporairement pour tester
        $courier = Courier::create($request->all());
        
        Log::info('Courrier créé:', $courier->toArray());
        
        return response()->json($courier, 201);
    } catch (\Exception $e) {
        Log::error('Erreur:', [
            'message' => $e->getMessage(),
            'trace' => $e->getTrace()
        ]);
        
        return response()->json([
            'message' => $e->getMessage()
        ], 500);
    }
}
