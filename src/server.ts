import express, { Request, Response } from 'express'
import { getMoviesByYear } from './movieService'

const app = express()
const PORT = process.env.PORT || 3000

app.get('/movies', async (req: Request, res: Response) => {
    const year = req.query.year

    if (typeof year !== 'string') {
        res.status(400).json({ error: "Year parameter is required and must be a string" })
        return
    }

    const trimmedYear = year.trim()
    const currentYear = new Date().getFullYear()
    const yearNumber = parseInt(trimmedYear)

    if (isNaN(yearNumber) || yearNumber > currentYear) {
        res.status(400).json({ error: `Year must be a valid year and not more then ${currentYear}` })
        return
    }

    try {
        const response = await getMoviesByYear(yearNumber)
        res.json(response)
    } catch (error) {
        console.error("Error fetching movies:", error)
        res.status(500).json({ error: "An error occurred while fetching movies" })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})

export default app